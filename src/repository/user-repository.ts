import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findById(userId: string): Promise<User | null>
  delete(userId: string): Promise<void>
  findMany(): Promise<User[] | null>
}
