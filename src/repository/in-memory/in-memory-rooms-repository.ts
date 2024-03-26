import { Class, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { InvalidUserError } from '../../use-cases/errors/invalid-user-id-error'
import { InvalidResourceError } from '../../use-cases/errors/invalid-resource-error'
import { RoomsRepository } from '../rooms-repository'

export class InMemoryClassRepository implements RoomsRepository {
  public rooms: Class[] = []
  async create(data: Prisma.ClassCreateInput) {
    if (!data.teacher || !data.teacher.connect || !data.teacher.connect.id) {
      throw new Error('O ID do professor não foi fornecido.')
    }

    const room = {
      id: data.id ?? randomUUID(),
      class_number: data.class_number,
      capacity: data.capacity,
      isAvaiable: data.isAvaiable,
      teacher_id: data.teacher.connect.id,
      studentId: null,
      students: [],
    }

    if (room) {
      this.rooms.push(room)
    }

    return room
  }

  async findById(userId: string) {
    if (!userId) {
      throw new InvalidUserError()
    }

    const rooms = this.rooms.filter((item) => item.teacher_id === userId)

    if (!rooms.length) {
      return null // ou pode retornar um array vazio [] se preferir
    }

    return rooms
  }

  async insertStudent(ownerId: string, userId: string, classId: string) {
    if (!ownerId) {
      throw new Error()
    }
    const room = this.rooms.find((item) => item.id === classId)

    // Adicione o userId à lista de alunos da sala de aula
    room?.students?.push({
      id: userId,
    })

    if (!room) {
      return null
    }

    return room
  }

  async removeStudent(
    ownerId: string,
    studentId: string,
    classId: string,
  ): Promise<void> {
    if (!ownerId) {
      throw new Error('Invalid owner ID')
    }

    const room = this.rooms.find((item) => item.teacher_id === ownerId)

    if (room?.teacher_id !== ownerId && room?.id !== classId) {
      throw new Error('Unauthorized')
    }

    const studentIndex = room?.students.findIndex(
      (student) => student.id === studentId,
    )

    if (studentIndex === -1) {
      throw new Error('Student not found in the room')
    }

    room?.students.splice(Number(studentIndex), 1)
  }

  async listStudentsByRoom(ownerId: string, classId: string) {
    const room = this.rooms.find(
      (item) => item.teacher_id === ownerId && item.id === classId,
    )

    if (!room) {
      return null
    }

    return room
  }

  async deleteClassRoom(ownerId: string, classId: string): Promise<void> {
    const room = this.rooms.find((item) => item.teacher_id === ownerId)

    if (room?.teacher_id !== ownerId) {
      throw new Error('Unauthorized')
    }
    const roomIndex = this.rooms.findIndex(
      (room) => room.id === classId && room.teacher_id === ownerId,
    )

    if (roomIndex === -1) {
      throw new Error('Classroom not found')
    }

    this.rooms.splice(roomIndex, 1)
  }

  async getClassRoomsByStudent(studentId: string) {
    const studentRooms = this.rooms.filter((room) =>
      room.students.some((student) => student.id === studentId),
    )

    if (!studentRooms.length) {
      return null // ou pode retornar um array vazio [] se preferir
    }

    return studentRooms
  }

  async updateRoom(
    ownerId: string,
    classId: string,
    data: Prisma.ClassUpdateInput,
  ) {
    // Verifique se ownerId e classId estão definidos
    if (!ownerId || !classId) {
      throw new InvalidResourceError()
    }

    // Encontre o índice da sala na matriz de salas
    const roomToUpdateIndex = this.rooms.findIndex(
      (room) => room.teacher_id === ownerId && room.id === classId,
    )

    // Se a sala não for encontrada, lance um erro
    if (roomToUpdateIndex === -1) {
      throw new InvalidResourceError()
    }

    // Obtenha a sala a ser atualizada
    const currentRoom = this.rooms[roomToUpdateIndex]

    // Atualize os campos da sala com base nos dados fornecidos
    const updatedRoomData: Class = {
      ...currentRoom,
      class_number: (data.class_number as number) ?? currentRoom.class_number,
      capacity: (data.capacity as number) ?? currentRoom.capacity,
      isAvaiable: (data.isAvaiable as boolean) ?? currentRoom.isAvaiable,
      // Certifique-se de verificar se `teacher` está definido antes de acessá-lo
      teacher_id:
        (data.teacher?.connect?.id as string) ?? currentRoom.teacher_id,
      students: currentRoom.students,
    }

    // Atualize a sala na matriz de salas
    this.rooms[roomToUpdateIndex] = updatedRoomData

    // Retorne a sala atualizada
    return updatedRoomData
  }
}
