import { UsersRepository } from '../repository/user-repository'
import { InvalidUserError } from './errors/invalid-user-id-error'
import { RoomsRepository } from '../repository/rooms-repository'

interface FormattedStudent {
  id: string
  name: string // Adicionado para incluir o nome do aluno
}

interface FormattedRoom {
  id: string
  class_number: number
  capacity: number
  isAvaiable: boolean
  teacher: string
  students: FormattedStudent[] // Alterado para ser um array de estudantes
}
interface GetRoomUseCaseRequest {
  teacherId: string
}
interface GetRoomUseCaseResponse {
  room: FormattedRoom[]
}

export class GetRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private classRepository: RoomsRepository,
  ) {}

  async execute({
    teacherId,
  }: GetRoomUseCaseRequest): Promise<GetRoomUseCaseResponse> {
    const teacher = await this.usersRepository.findById(teacherId)

    if (!teacher || teacher.user_type !== 'TEACHER') {
      throw new InvalidUserError()
    }

    const rooms = await this.classRepository.findById(teacher.id)

    if (!rooms || rooms.length === 0) {
      throw new InvalidUserError()
    }

    const formattedRooms: FormattedRoom[] = []
    for (const room of rooms) {
      const formattedStudents: FormattedStudent[] = []
      for (const student of room.students) {
        const studentDetails = await this.usersRepository.findById(student.id)
        if (studentDetails) {
          formattedStudents.push({ id: student.id, name: studentDetails.name })
        }
      }

      const formattedRoom: FormattedRoom = {
        id: room.id,
        class_number: room.class_number,
        capacity: room.capacity - formattedStudents.length,
        isAvaiable: room.capacity > formattedStudents.length,
        teacher: teacher.name,
        students: formattedStudents,
      }
      formattedRooms.push(formattedRoom)
    }

    return { room: formattedRooms }
  }
}
