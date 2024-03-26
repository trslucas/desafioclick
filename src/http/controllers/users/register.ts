import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { RegisterUseCase } from '../../../use-cases/register-use-case'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    registration: z.number(),
    birth_date: z.coerce.date(),
    user_type: z.string(),
  })

  const { birth_date, email, name, registration, user_type } =
    registerSchema.parse(request.body)

  try {
    const { user } = await registerUseCase.execute({
      birth_date,
      email,
      name,
      registration,
      user_type,
    })

    reply.status(201).send({ user })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
