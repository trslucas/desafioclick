import { User } from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  registration: number
  birth_date: Date
  user_type: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute() {
    await this.usersRepository.create({})
  }
}
