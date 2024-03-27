import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { RoomsRepository } from '../repository/rooms-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface GetStudentsByRoomUseCaseRequest {
  ownerId: string
  classId: string
}

interface GetStudentsByRoomUseCaseResponse {
  room: Class
}

export class GetStudentsByRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    ownerId,
    classId,
  }: GetStudentsByRoomUseCaseRequest): Promise<GetStudentsByRoomUseCaseResponse> {
    const teacher = await this.usersRepository.findById(ownerId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserError()
    }
    const room = await this.classRepository.listStudentsByRoom(
      teacher.id,
      classId,
    )

    if (!room) {
      throw new InvalidResourceError()
    }

    return {
      room,
    }
  }
}
