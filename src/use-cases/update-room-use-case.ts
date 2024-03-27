import { Class, Prisma } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { RoomsRepository } from '../repository/rooms-repository'

import { InvalidUserTypeError } from './errors/invalid-user-type-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface UpdateRoomUseCaseRequest {
  id?: string
  ownerId: string
  classId: string
  class_number?: number
  capacity?: number
  isAvaiable?: boolean
  students?:
    | {
        id: string // Alterado para garantir que tenha um ID
      }[]
    | null
}

interface UpdateRoomUseCaseResponse {
  room: Class
}

export class UpdateRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    ownerId,
    classId,
    capacity,
    class_number,
    id,
    isAvaiable,
    students,
  }: UpdateRoomUseCaseRequest): Promise<UpdateRoomUseCaseResponse> {
    const teacher = await this.usersRepository.findById(ownerId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserTypeError()
    }

    const rooms = await this.classRepository.findById(ownerId)

    if (!rooms) {
      throw new InvalidResourceError()
    }

    const classRoomToFind = rooms.find((room) => room.teacher_id === ownerId)

    if (!classRoomToFind) {
      throw new InvalidResourceError()
    }

    const updateData: Prisma.ClassUpdateInput = {
      capacity,
      class_number,
      id,
      isAvaiable,
    }

    if (students) {
      updateData.students = {
        connect: students.map((student) => ({ id: student.id })),
      }
    } else {
      updateData.students = undefined
    }

    const updateDroom = await this.classRepository.updateRoom(
      ownerId,
      classId,
      updateData,
    )

    return { room: updateDroom }
  }
}
