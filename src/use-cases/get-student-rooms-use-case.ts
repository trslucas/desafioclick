import { Class } from '@prisma/client'
import { UsersRepository } from '../repository/user-repository'
import { RoomsRepository } from '../repository/rooms-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface GetStudentRoomsUseCaseRequest {
  studentId: string
}

interface GetStudenetRoomsUseCaseResponse {
  rooms: Class[]
}

export class GetStudentRoomsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    studentId,
  }: GetStudentRoomsUseCaseRequest): Promise<GetStudenetRoomsUseCaseResponse> {
    const student = await this.usersRepository.findById(studentId)

    if (!student || student.user_type !== 'STUDENT') {
      throw new InvalidUserError()
    }

    const rooms = await this.classRepository.getClassRoomsByStudent(student.id)

    if (!rooms) {
      throw new InvalidResourceError()
    }

    for (const room of rooms) {
      if (room.teacher_id) {
        // Verifica se o teacher_id não é null
        const teacherDetails = await this.usersRepository.findById(
          room.teacher_id,
        )
        room.teacher_id = teacherDetails ? teacherDetails.name : 'Unknown' // Substitui o teacher_id pelo nome do professor
      }
    }

    return {
      rooms,
    }
  }
}
