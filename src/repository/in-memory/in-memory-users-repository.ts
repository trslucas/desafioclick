import { Prisma, User, UserType } from '@prisma/client'
import { UsersRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []
  async create(data: Prisma.UserCreateInput): Promise<User> {
    if (!data.user_type) {
      throw new Error('Provide a user type')
    }
    const user = {
      id: data.id ?? randomUUID(),
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

  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    if (!userId) {
      throw new Error('User not found')
    }

    const userIndex = this.users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const currentUser = this.users[userIndex]

    const updatedUser: User = {
      ...currentUser,
      id: userId,
      name: (data.name as string) ?? currentUser.name,
      email: (data.email as string) ?? currentUser.email,
      registration: (data.registration as number) ?? currentUser.registration,
      birth_date: (data.birth_date as Date) ?? currentUser.birth_date,
      user_type: (data.user_type as UserType) ?? currentUser.user_type,
      created_at: currentUser.created_at,
    }

    this.users[userIndex] = updatedUser

    return updatedUser
  }

  async findById(userId: string) {
    if (!userId) {
      throw new Error('User not found')
    }
    const user = this.users.find((user) => user.id === userId)

    if (!user) {
      return null
    }
    return user
  }

  async delete(userId: string) {
    const user = this.users.findIndex((user) => user.id === userId)

    this.users.splice(user, 1)
  }

  async findMany() {
    const users = this.users

    return users
  }
}
