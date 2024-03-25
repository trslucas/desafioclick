import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'

import { ClassRepository } from '../repository/class-repository'

interface CreateRoomUseCaseRequest {
  class_number: number
  capacity: number
  isAvaiable: boolean
  owner_id: string
}

interface CreateRoomUseCaseResponse {
  room: Class
}

export class CreateRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    class_number,
    capacity,
    isAvaiable,
    owner_id,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const user = await this.usersRepository.findById(owner_id)

    if (!user || user.user_type !== 'TEACHER') {
      throw new Error()
    }

    const room = await this.classRepository.create({
      owner_id,
      capacity,
      class_number,
      isAvaiable,
    })

    return {
      room,
    }
  }
}
