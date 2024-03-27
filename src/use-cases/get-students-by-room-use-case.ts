import { Class } from '@prisma/client' // Adicione a importação do modelo de dados do Prisma
import { UsersRepository } from '../repository/user-repository'
import { RoomsRepository } from '../repository/rooms-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { InvalidResourceError } from './errors/invalid-resource-error'

interface Student {
  id: string
  name: string
}

interface GetStudentsByRoomUseCaseRequest {
  ownerId: string
  classId: string
}

interface GetStudentsByRoomUseCaseResponse {
  room: Class & { students: Student[] }
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

    const students: Student[] = await Promise.all(
      room.students.map(async (student) => {
        const userDetails = await this.usersRepository.findById(student.id)
        return { id: student.id, name: userDetails?.name || '' }
      }),
    )

    const response: GetStudentsByRoomUseCaseResponse = {
      room: { ...room, students },
    }

    return response
  }
}
