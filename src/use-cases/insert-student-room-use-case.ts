import { ClassRepository } from '../repository/class-repository'
import { Class } from '@prisma/client'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'
import { UsersRepository } from '../repository/user-repository'
import { ExceededCapacityTypeError } from './errors/max-capacity-error'

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

    const room = await this.classRepository.insertStudent(ownerId, studentId)

    const maxStudents = Number(room?.students.length)
    const roomCapacity = Number(room?.capacity)

    const exceedLimit = roomCapacity < maxStudents

    if (exceedLimit) {
      throw new ExceededCapacityTypeError()
    }

    if (!room) {
      throw new Error()
    }

    const test = room?.students?.filter((student) => student.id === studentId)
    const already = test.length >= 2

    if (already) {
      throw new UserAlreadyExistisError()
    }
    return { room }
  }
}
