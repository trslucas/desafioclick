import { User } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'

interface GetAllUserUseCaseResponse {
  users: User[]
}

export class GetAllUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<GetAllUserUseCaseResponse> {
    const users = await this.usersRepository.findMany()

    if (!users) {
      throw new InvalidUserError()
    }
    return {
      users,
    }
  }
}
