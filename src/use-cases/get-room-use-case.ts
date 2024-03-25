import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { ClassRepository } from '../repository/class-repository'

interface GetRoomUseCaseRequest {
  userId: string
}

interface GetRoomUseCaseResponse {
  room: Class
}

export class GetRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    userId,
  }: GetRoomUseCaseRequest): Promise<GetRoomUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new InvalidUserError()
    }

    const room = await this.classRepository.findById(userId)

    if (!room) {
      throw new InvalidUserError()
    }

    return { room }
  }
}
