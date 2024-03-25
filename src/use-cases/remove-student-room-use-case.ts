import { ClassRepository } from '../repository/class-repository'

import { UsersRepository } from '../repository/user-repository'

interface RemoveStudentRoomUseCaseRequest {
  studentId: string
  ownerId: string
}

export class RemoveStudentRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: ClassRepository,
  ) {}

  async execute({
    studentId,
    ownerId,
  }: RemoveStudentRoomUseCaseRequest): Promise<void> {
    if (!ownerId) {
      throw new Error()
    }

    await this.classRepository.removeStudent(ownerId, studentId)

    // if (userAlreadyDeleted) {
    //   console.log(userAlreadyDeleted)
    //   throw new InvalidUserError()
    // }
  }
}
