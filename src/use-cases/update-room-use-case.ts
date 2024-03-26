import { Class, Student } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { ClassRepository } from '../repository/class-repository'

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
    private classRepository: ClassRepository,
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

    const room = await this.classRepository.findById(ownerId)

    const classRoomToFind = room?.find(
      (room) => room.owner_id === ownerId && room.id === classId,
    )

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
        students,
      },
    )

    return {
      room: updateDroom,
    }
  }
}
