import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { RoomsRepository } from '../repository/rooms-repository'

interface CreateRoomUseCaseRequest {
  class_number: number
  capacity: number
  isAvaiable: boolean
  teacher_id: string
}

interface CreateRoomUseCaseResponse {
  room: Class
}

export class CreateRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    class_number,
    capacity,
    isAvaiable,
    teacher_id,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const user = await this.usersRepository.findById(teacher_id)

    if (!user || user.user_type !== 'TEACHER') {
      throw new Error()
    }

    const teacher = {
      connect: { id: teacher_id }, // Substitua teacherId pelo ID do professor
    }

    const room = await this.classRepository.create({
      teacher,
      capacity,
      class_number,
      isAvaiable,
    })

    return {
      room,
    }
  }
}
