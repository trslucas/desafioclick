import { RoomsRepository } from '../repository/rooms-repository'
import { Class } from '@prisma/client'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'
import { UsersRepository } from '../repository/user-repository'
import { ExceededCapacityTypeError } from './errors/max-capacity-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface InsertStudentRoomUseCaseRequest {
  studentId: string
  ownerId: string
  classId: string
}

interface InsertStudentRoomUseCaseResponse {
  room: Class
}

export class InsertUserInRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    studentId,
    ownerId,
    classId,
  }: InsertStudentRoomUseCaseRequest): Promise<InsertStudentRoomUseCaseResponse> {
    if (!ownerId) {
      throw new Error()
    }

    const insertRoomAvaiable = await this.classRepository.insertStudent(
      ownerId,
      studentId,
      classId,
    )

    if (!insertRoomAvaiable) {
      throw new InvalidResourceError()
    }

    const maxStudents = Number(insertRoomAvaiable?.students?.length)
    const roomCapacity = Number(insertRoomAvaiable?.capacity)

    const exceedLimit = roomCapacity < maxStudents

    const canInsertUser = roomCapacity > maxStudents

    const checkAvailability = roomCapacity === maxStudents

    if (canInsertUser && insertRoomAvaiable?.capacity) {
      insertRoomAvaiable.capacity = roomCapacity - maxStudents
    }

    if (checkAvailability) {
      if (insertRoomAvaiable) {
        insertRoomAvaiable.isAvaiable = false
      }
    }

    if (exceedLimit) {
      throw new ExceededCapacityTypeError()
    }

    const studentsArray = insertRoomAvaiable?.students?.length >= 2
    const alreadyStudent = insertRoomAvaiable?.students?.some(
      (student) => student.id === studentId,
    )

    const already = studentsArray && alreadyStudent

    if (already) {
      throw new UserAlreadyExistisError()
    }

    return { room: insertRoomAvaiable }
  }
}
