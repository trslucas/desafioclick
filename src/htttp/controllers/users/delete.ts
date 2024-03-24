import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { z } from 'zod'
import { DeleteUserUseCase } from '../../../use-cases/delete-user-use-case'
import { InvalidUserError } from '../../../use-cases/errors/invalid-user-id-error'

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const deleteUseCase = new DeleteUserUseCase(usersRepository)

  const registerSchema = z.object({
    userId: z.string(),
  })

  const { userId } = registerSchema.parse(request.params)

  try {
    await deleteUseCase.execute({
      userId,
    })

    reply.status(200).send({})
  } catch (error) {
    if (error instanceof InvalidUserError)
      return reply.status(400).send({ message: error.message })
  }
}
