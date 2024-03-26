import { Class, Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import { InvalidUserError } from '../../use-cases/errors/invalid-user-id-error'
import { RoomsRepository } from '../rooms-repository'
import { UserAlreadyExistisError } from '../../use-cases/errors/user-already-exists-error'
import { InvalidResourceError } from '../../use-cases/errors/invalid-resource-error'
import { ExceededCapacityTypeError } from '../../use-cases/errors/max-capacity-error'
import { count } from 'console'

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

  async insertStudent(ownerId: string, studentId: string, classId: string) {
    const room = await prisma.class.findMany({
      where: {
        teacher_id: ownerId,
        id: classId,
      },
    })

    const roomToCheck = await this.findById(ownerId)

    const checkedRoom = roomToCheck.find((r) => r.id === classId)

    const checkedRoomLenght = checkedRoom?.students.length

    const checkedRoomCapacity = checkedRoom?.capacity

    console.log(checkedRoomLenght, checkedRoomCapacity)

    const isNotAvailable =
      Number(checkedRoomLenght) >= Number(checkedRoomCapacity)

    if (isNotAvailable) {
      await prisma.class.update({
        where: {
          id: classId,
        },
        data: {
          isAvaiable: false,
        },
      })
      throw new ExceededCapacityTypeError()
    }

    if (!checkedRoom) {
      throw new InvalidResourceError()
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        id: studentId,
        classes: {
          some: {
            id: classId,
          },
        },
      },
    })

    if (existingStudent) {
      throw new UserAlreadyExistisError()
    }

    const student = await prisma.class.update({
      where: {
        id: classId,
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

  async removeStudent(ownerId: string, studentId: string, classId: string) {
    const room = await prisma.class.findFirst({
      where: {
        teacher_id: ownerId,
        id: classId,
      },
    })

    // Verifica se a sala de aula foi encontrada
    if (!room) {
      throw new InvalidResourceError()
    }

    // Remove o aluno apenas da sala de aula específica
    await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        classes: {
          disconnect: {
            id: classId,
          },
        },
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
