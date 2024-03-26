import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { GetAllUsersUseCase } from '../../../use-cases/get-all-users-use-case'

export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const getAllUsersUseCase = new GetAllUsersUseCase(usersRepository)

  try {
    const { users } = await getAllUsersUseCase.execute()

    reply.status(201).send({ users })
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        return reply.status(400).send({ message: error.message })
      }
    }
  }
}
