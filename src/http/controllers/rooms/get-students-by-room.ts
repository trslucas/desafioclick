import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { GetStudentsByRoomUseCase } from '../../../use-cases/get-students-by-room-use-case'
import { z } from 'zod'

export async function getStudentsByRoom(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()

  const getStudentByRoomUseCase = new GetStudentsByRoomUseCase(
    usersRepository,
    roomsRepository,
  )

  const getStudentsByRoomParamsSchema = z.object({
    teacherId: z.string(),
    classId: z.string(),
  })

  const { classId, teacherId } = getStudentsByRoomParamsSchema.parse(
    request.params,
  )

  try {
    const { room } = await getStudentByRoomUseCase.execute({
      classId,
      ownerId: teacherId,
    })

    reply.status(200).send({ room })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      reply.status(400).send({ message: error.message })
    }
  }
}
