import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'

import { z } from 'zod'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { GetRoomUseCase } from '../../../use-cases/get-room-use-case'

export async function getRoomByTeacherId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()
  const getRoomUseCase = new GetRoomUseCase(usersRepository, roomsRepository)

  const registerSchema = z.object({
    teacherId: z.string(),
  })

  const { teacherId } = registerSchema.parse(request.params)

  try {
    const { room } = await getRoomUseCase.execute({ teacherId })

    reply.status(200).send({ room })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
