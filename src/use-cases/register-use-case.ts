import { User, UserType } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { InvalidUserTypeError } from './errors/invalid-user-type-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

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
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    registration,
    birth_date,
    user_type,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userTypeMap: Record<string, UserType> = {
      STUDENT: UserType.STUDENT,
      TEACHER: UserType.TEACHER,
    }

    const userType: UserType = userTypeMap[user_type]

    if (!userType) {
      throw new InvalidUserTypeError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      registration,
      birth_date,
      user_type: userType,
    })

    if (!user) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
