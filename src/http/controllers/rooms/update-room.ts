import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { UpdateRoomUseCase } from '../../../use-cases/update-room-use-case'
import { z } from 'zod'

export async function updateRoom(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()

  const updateRoomUseCase = new UpdateRoomUseCase(
    usersRepository,
    roomsRepository,
  )

  const updateRoomParamsSchema = z.object({
    teacherId: z.string(),
    classId: z.string(),
  })

  const updateRoomBodySchema = z.object({
    capacity: z.number().optional(),
    class_number: z.number().optional(),
    id: z.string().optional(),
    isAvaiable: z.boolean().optional(),
    students: z
      .array(
        z.object({
          id: z.string(),
        }),
      )
      .optional(),
  })

  const { teacherId, classId } = updateRoomParamsSchema.parse(request.params)

  const { capacity, class_number, id, isAvaiable, students } =
    updateRoomBodySchema.parse(request.body)

  try {
    const { room } = await updateRoomUseCase.execute({
      ownerId: teacherId,
      classId,
      capacity,
      class_number,
      id,
      isAvaiable,
      students,
    })
    reply.status(200).send({ room })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      reply.status(400).send({ message: error.message })
    }
  }
}
