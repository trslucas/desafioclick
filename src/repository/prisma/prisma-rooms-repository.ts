import { Class, Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import { InvalidUserError } from '../../use-cases/errors/invalid-user-id-error'
import { RoomsRepository } from '../rooms-repository'
import { UserAlreadyExistisError } from '../../use-cases/errors/user-already-exists-error'
import { InvalidResourceError } from '../../use-cases/errors/invalid-resource-error'

export class PrismaRoomsRepository implements RoomsRepository {
  async create(data: Prisma.ClassCreateInput) {
    const room = await prisma.class.create({
      data,
    })

    return room
  }

  async findById(ownerId: string) {
    if (!ownerId) {
      throw new InvalidUserError()
    }
    const room = await prisma.class.findMany({
      where: {
        teacher_id: ownerId,
      },
      include: {
        students: true, // Incluindo os alunos associados à classe
      },
    })

    return room
  }

  async updateRoom(
    ownerId: string,
    classId: string,
    data: Prisma.ClassUpdateInput,
  ) {
    const room = await prisma.class.update({
      where: {
        teacher_id: ownerId,
        id: classId,
      },
      data,
    })

    return room
  }

  async deleteClassRoom(ownerId: string, classId: string) {
    await prisma.class.delete({
      where: {
        teacher_id: ownerId,
        id: classId,
      },
    })
  }

  async insertStudent(ownerId: string, studentId: string) {
    const room = await prisma.class.findMany({
      where: {
        teacher_id: ownerId,
      },
    })

    const roomToFind = room.find((r) => r.teacher_id === ownerId)

    if (!roomToFind) {
      throw new InvalidResourceError()
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        id: studentId,
        classes: {
          some: {
            id: roomToFind.id,
          },
        },
      },
    })

    if (existingStudent) {
      throw new UserAlreadyExistisError()
    }

    const student = await prisma.class.update({
      where: {
        id: roomToFind?.id,
      },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
    })

    return student
  }

  async removeStudent(ownerId: string, studentId: string) {
    const room = await prisma.class.findMany({
      where: {
        teacher_id: ownerId,
      },
    })

    const roomToFind = room.find((r) => r.teacher_id === ownerId)
    await prisma.student.delete({
      where: {
        classes: {
          some: {
            id: roomToFind?.id,
          },
        },
        id: studentId,
      },
    })
  }

  async listStudentsByRoom(ownerId: string, classId: string) {
    const room = await prisma.class.findUnique({
      where: {
        teacher_id: ownerId,
        id: classId,
      },
    })

    return room
  }

  async getClassRoomsByStudent(studentId: string): Promise<Class[] | null> {
    const studentRooms = await prisma.student.findMany({
      where: {
        id: studentId,
      },
      include: {
        classes: true,
      },
    })

    if (!studentRooms) {
      return null
    }

    const classRooms = studentRooms.map((studentRoom) => studentRoom?.classes)

    const flattenedClassRooms = classRooms.flat()

    return flattenedClassRooms
  }
}
