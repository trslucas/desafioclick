import { Prisma } from '@prisma/client'
import { UsersRepository } from '../user-repository'
import { prisma } from '../../lib/prisma'
import { InvalidUserError } from '../../use-cases/errors/invalid-user-id-error'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    if (user.user_type === 'STUDENT') {
      await prisma.student.create({
        data: {
          id: user.id,
        },
      })
    }

    if (user.user_type === 'TEACHER') {
      await prisma.teacher.create({
        data: {
          id: user.id,
        },
      })
    }

    return user
  }

  async update(userId: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      data,
      where: {
        id: userId,
      },
    })

    return user
  }

  async findById(userId: string) {
    if (!userId) {
      throw new InvalidUserError()
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async delete(userId: string) {
    if (!userId) {
      throw new InvalidUserError()
    }

    const user = await this.findById(userId)

    if (!user) {
      throw new InvalidUserError()
    }
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
