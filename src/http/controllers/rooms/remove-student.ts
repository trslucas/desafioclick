import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '../../../repository/prisma/prisma-users-repository'
import { PrismaRoomsRepository } from '../../../repository/prisma/prisma-rooms-repository'
import { RemoveStudentRoomUseCase } from '../../../use-cases/remove-student-room-use-case'
import { z } from 'zod'

export async function removeStudent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const usersRepository = new PrismaUsersRepository()
  const classRepository = new PrismaRoomsRepository()

  const removeStudentRoomUseCase = new RemoveStudentRoomUseCase(
    usersRepository,
    classRepository,
  )

  const removeStudentRoomBodySchema = z.object({
    teacher_id: z.string(),
  })

  const removeStudentRoomParamsSchema = z.object({
    studentId: z.string(),
    classId: z.string(),
  })

  const { teacher_id } = removeStudentRoomBodySchema.parse(request.body)

  const { studentId, classId } = removeStudentRoomParamsSchema.parse(
    request.params,
  )

  try {
    await removeStudentRoomUseCase.execute({
      classId,
      ownerId: teacher_id,
      studentId,
    })
    reply.status(203).send()
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      reply.status(400).send({ message: error.message })
    }
  }
}
