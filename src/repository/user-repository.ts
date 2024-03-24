import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findById(userId: string): Promise<User | null>
  update(userId: string, data: Prisma.UserUpdateInput): Promise<User>
  delete(userId: string): Promise<void>
  findMany(): Promise<User[] | null>
}
