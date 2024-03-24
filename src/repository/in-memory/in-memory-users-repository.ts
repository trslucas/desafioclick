import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []
  async create(data: Prisma.UserCreateInput): Promise<User> {
    if (!data.user_type) {
      throw new Error('Provide a user type')
    }
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      registration: data.registration,
      birth_date: data.birth_date as Date,
      user_type: data.user_type,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
