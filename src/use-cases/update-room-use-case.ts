import { Class, Student } from '@prisma/client'
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
  students?: Student[]
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

    const studentId = classRoomToFind?.studentId

    if (!classRoomToFind) {
      throw new InvalidResourceError()
    }

    const updateDroom = await this.classRepository.updateRoom(
      ownerId,
      classId,
      {
        capacity,
        class_number,
        id,
        isAvaiable,
        Student: {
          connect: {
            id: studentId as string,
          },
        },
        students,
      },
    )

    return {
      room: updateDroom,
    }
  }
}
