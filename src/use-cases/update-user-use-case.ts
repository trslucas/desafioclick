import { User, UserType } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { InvalidUserTypeError } from './errors/invalid-user-type-error'

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  registration?: number
  birth_date?: Date
  user_type?: string
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    birth_date,
    email,
    name,
    registration,
    user_type,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const userType: UserType | undefined = user_type as UserType | undefined

    if (!userType) {
      throw new InvalidUserTypeError()
    }
    const updatedUser = await this.usersRepository.update(userId, {
      birth_date,
      email,
      name,
      registration,
      user_type: userType,
    })

    return {
      user: updatedUser,
    }
  }
}
