import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { z } from 'zod'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { InsertUserInRoomUseCase } from '../../../use-cases/insert-student-room-use-case'

export async function insertStudent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const roomsRepository = new PrismaRoomsRepository()
  const roomUseCase = new InsertUserInRoomUseCase(
    usersRepository,
    roomsRepository,
  )

  const registerSchema = z.object({
    teacher_id: z.string(),
    student_id: z.string(),
  })

  const { student_id, teacher_id } = registerSchema.parse(request.body)

  try {
    const { room } = await roomUseCase.execute({
      ownerId: teacher_id,
      studentId: student_id,
    })

    reply.status(201).send({ room })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
