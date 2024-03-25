import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { ClassRepository } from '../repository/class-repository'

interface GetRoomUseCaseRequest {
  userId: string
}

interface GetRoomUseCaseResponse {
  room: Class[]
}

export class GetRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    userId,
  }: GetRoomUseCaseRequest): Promise<GetRoomUseCaseResponse> {
    const teacher = await this.usersRepository.findById(userId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserError()
    }

    const rooms = await this.classRepository.findById(teacher.id)

    if (!rooms || rooms.length === 0) {
      throw new InvalidUserError()
    }

    return { room: rooms }
  }
}
