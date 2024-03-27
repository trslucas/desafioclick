import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { DeleteClassRoomUseCase } from '../../../use-cases/delete-room-use-case'
import { z } from 'zod'

export async function deleteRoom(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()

  const deleteRoomUseCase = new DeleteClassRoomUseCase(
    usersRepository,
    roomsRepository,
  )

  const deleteRoomParamsSchema = z.object({
    teacherId: z.string(),
    classId: z.string(),
  })

  const { teacherId, classId } = deleteRoomParamsSchema.parse(request.params)

  try {
    await deleteRoomUseCase.execute({
      classId,
      ownerId: teacherId,
    })

    reply.status(200).send({ message: 'Sala deletada com sucesso!' })
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      reply.status(400).send({ message: error.message })
    }
  }
}
