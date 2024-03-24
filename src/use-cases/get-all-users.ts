import { User } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'

interface GetAllUserUseCaseResponse {
  users: User[]
}

export class GetAllUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<GetAllUserUseCaseResponse> {
    const users = await this.usersRepository.findMany()

    if (!users) {
      throw new Error('User not found')
    }
    return {
      users,
    }
  }
}
