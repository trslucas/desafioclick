import { ClassRepository } from '../repository/class-repository'
import { Class } from '@prisma/client'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'
import { UsersRepository } from '../repository/user-repository'
import { ExceededCapacityTypeError } from './errors/max-capacity-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface InsertStudentRoomUseCaseRequest {
  studentId: string
  ownerId: string
}

interface InsertStudentRoomUseCaseResponse {
  room: Class
}

export class InsertUserInRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    studentId,
    ownerId,
  }: InsertStudentRoomUseCaseRequest): Promise<InsertStudentRoomUseCaseResponse> {
    if (!ownerId) {
      throw new Error()
    }

    const insertRoomAvaiable = await this.classRepository.insertStudent(
      ownerId,
      studentId,
    )

    const maxStudents = Number(insertRoomAvaiable?.students.length)
    const roomCapacity = Number(insertRoomAvaiable?.capacity)

    const exceedLimit = roomCapacity < maxStudents

    const checkAvailability = roomCapacity === maxStudents

    if (checkAvailability) {
      if (insertRoomAvaiable) {
        insertRoomAvaiable.isAvaiable = false
      }
    }

    if (exceedLimit) {
      throw new ExceededCapacityTypeError()
    }

    if (!insertRoomAvaiable) {
      throw new InvalidResourceError()
    }

    const test = insertRoomAvaiable?.students?.filter(
      (student) => student.id === studentId,
    )
    const already = test.length >= 2

    if (already) {
      throw new UserAlreadyExistisError()
    }

    return { room: insertRoomAvaiable }
  }
}
