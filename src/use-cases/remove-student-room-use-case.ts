import { RoomsRepository } from '../repository/rooms-repository'

import { UsersRepository } from '../repository/user-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'

interface RemoveStudentRoomUseCaseRequest {
  studentId: string
  ownerId: string
}

export class RemoveStudentRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    studentId,
    ownerId,
  }: RemoveStudentRoomUseCaseRequest): Promise<void> {
    const teacher = await this.usersRepository.findById(ownerId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserError()
    }

    await this.classRepository.removeStudent(teacher.id, studentId)
  }
}
