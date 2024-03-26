import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'

import { z } from 'zod'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { GetStudentRoomsUseCase } from '../../../use-cases/get-student-rooms-use-case'

export async function getRoomByStudentId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()
  const getRoomByStudentUseCase = new GetStudentRoomsUseCase(
    usersRepository,
    roomsRepository,
  )

  const registerSchema = z.object({
    studentId: z.string(),
  })

  const { studentId } = registerSchema.parse(request.params)

  try {
    const { rooms } = await getRoomByStudentUseCase.execute({ studentId })

    reply.status(200).send({ rooms })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
