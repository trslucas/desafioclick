import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'

import { GetAllUsersUseCase } from '../../../use-cases/get-all-users'

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
    return reply.status(400).send({ message: error.message })
  }
}
