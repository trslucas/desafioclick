import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { ClassRepository } from '../repository/class-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'

interface GetStudentsByRoomUseCaseRequest {
  ownerId: string
  classId: string
}

interface GetStudentsByRoomUseCaseResponse {
  room: Class
}

export class GetStudentsByRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    ownerId,
    classId,
  }: GetStudentsByRoomUseCaseRequest): Promise<GetStudentsByRoomUseCaseResponse> {
    const teacher = await this.usersRepository.findById(ownerId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserError()
    }
    const room = await this.classRepository.listStudentsByRoom(
      teacher.id,
      classId,
    )

    if (!room) {
      throw new Error()
    }

    return {
      room,
    }
  }
}
