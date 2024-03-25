import { ClassRepository } from '../repository/class-repository'
import { UsersRepository } from '../repository/user-repository'
import { InvalidResourceError } from './errors/invalid-resource-error'
import { InvalidUserError } from './errors/invalid-user-id-error'

interface DeleteClassRoomUseCaseRequest {
  ownerId: string
  classId: string
}

export class DeleteClassRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    ownerId,
    classId,
  }: DeleteClassRoomUseCaseRequest): Promise<void> {
    const teacher = await this.usersRepository.findById(ownerId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserError()
    }
    const room = await this.classRepository.findById(teacher.id)

    const teacherRoom = room?.find((room) => room.owner_id === teacher.id)

    if (teacherRoom?.id !== classId) {
      throw new InvalidResourceError()
    }

    if (room) {
      await this.classRepository.deleteClassRoom(teacher.id, classId)
    }
  }
}
