import { Prisma } from '@prisma/client'
import { UsersRepository } from '../user-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async delete(userId: string) {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
  }

  async findMany() {
    const users = await prisma.user.findMany()

    return users
  }
}
