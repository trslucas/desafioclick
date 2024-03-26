import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'

import { GetUserUseCase } from '../../../use-cases/get-user-use-case'
import { z } from 'zod'

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const getUserByIdUseCase = new GetUserUseCase(usersRepository)

  const registerSchema = z.object({
    userId: z.string(),
  })

  const { userId } = registerSchema.parse(request.params)

  try {
    const { user } = await getUserByIdUseCase.execute({ userId })

    reply.status(200).send({ user })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
