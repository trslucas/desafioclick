import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { z } from 'zod'
import { CreateRoomUseCase } from '../../../use-cases/create-room-use-case'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()
  const roomUseCase = new CreateRoomUseCase(usersRepository, roomsRepository)

  const registerSchema = z.object({
    class_number: z.number(),
    capacity: z.number(),
    isAvaiable: z.boolean(),
    teacher_id: z.string(),
  })

  const { capacity, class_number, isAvaiable, teacher_id } =
    registerSchema.parse(request.body)

  try {
    const { room } = await roomUseCase.execute({
      capacity,
      class_number,
      isAvaiable,
      teacher_id,
    })

    reply.status(201).send({ room })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
