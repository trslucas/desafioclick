import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { ClassRepository } from '../repository/class-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface GetStudentRoomsUseCaseRequest {
  studentId: string
}

interface GetStudenetRoomsUseCaseResponse {
  rooms: Class[]
}

export class GetStudentRoomsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    studentId,
  }: GetStudentRoomsUseCaseRequest): Promise<GetStudenetRoomsUseCaseResponse> {
    const student = await this.usersRepository.findById(studentId)

    if (!student || student?.user_type !== 'STUDENT') {
      throw new InvalidUserError()
    }

    const room = await this.classRepository.getClassRoomsByStudent(student?.id)

    if (!room) {
      throw new InvalidResourceError()
    }

    return {
      rooms: room,
    }
  }
}
