import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { UpdateUserUseCase } from '../../../use-cases/update-user-use-case'
import { z } from 'zod'
import { InvalidUserError } from '../../../use-cases/errors/invalid-user-id-error'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const updateUserUseCase = new UpdateUserUseCase(usersRepository)

  const updateUserParamsSchema = z.object({
    userId: z.string(),
  })
  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    birth_date: z.coerce.date().optional(),
    email: z.string().optional(),
    registration: z.number().optional(),
    user_type: z.enum(['TEACHER', 'STUDENT']).optional(),
  })

  const { birth_date, email, registration, user_type, name } =
    updateUserBodySchema.parse(request.body)
  const { userId } = updateUserParamsSchema.parse(request.params)

  try {
    const updatedUser = await updateUserUseCase.execute({
      userId,
      birth_date,
      email,
      registration,
      user_type,
      name,
    })

    reply.status(201).send({
      updatedUser,
    })
  } catch (error) {
    if (error instanceof InvalidUserError) {
      return reply.status(500).send({
        message: error.message,
      })
    }
  }
}
