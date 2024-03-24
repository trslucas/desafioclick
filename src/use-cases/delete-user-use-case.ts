import { UsersRepository } from '../repository/user-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserUseCaseRequest): Promise<void> {
    if (!userId) {
      throw new Error('User not found')
    }
    await this.usersRepository.delete(userId)
  }
}
