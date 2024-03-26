import { Class, Prisma } from '@prisma/client'
import { ClassRepository } from '../class-repository'
import { randomUUID } from 'crypto'
import { InvalidUserError } from '../../use-cases/errors/invalid-user-id-error'
import { InvalidResourceError } from '../../use-cases/errors/invalid-resource-error'

export class InMemoryClassRepository implements ClassRepository {
  public rooms: Class[] = []
  async create(data: Prisma.ClassCreateInput) {
    if (!data.owner_id) {
      throw new Error()
    }

    const room = {
      id: data.id ?? randomUUID(),
      class_number: data.class_number,
      capacity: data.capacity,
      isAvaiable: data.isAvaiable,
      owner_id: data.owner_id,
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

    const rooms = this.rooms.filter((item) => item.owner_id === userId)

    if (!rooms.length) {
      return null // ou pode retornar um array vazio [] se preferir
    }

    return rooms
  }

  async insertStudent(ownerId: string, userId: string) {
    if (!ownerId) {
      throw new Error()
    }
    const room = this.rooms.find((item) => item.id === ownerId)

    room?.students.push({
      userId,
      id: userId,
      classId: room.id,
    })

    if (!room) {
      return null
    }

    return room
  }

  async removeStudent(ownerId: string, studentId: string): Promise<void> {
    if (!ownerId) {
      throw new Error('Invalid owner ID')
    }

    const room = this.rooms.find((item) => item.owner_id === ownerId)

    if (room?.owner_id !== ownerId) {
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
      (item) => item.owner_id === ownerId && item.id === classId,
    )

    if (!room) {
      return null
    }

    return room
  }

  async deleteClassRoom(ownerId: string, classId: string): Promise<void> {
    const room = this.rooms.find((item) => item.owner_id === ownerId)

    if (room?.owner_id !== ownerId) {
      throw new Error('Unauthorized')
    }
    const roomIndex = this.rooms.findIndex(
      (room) => room.id === classId && room.owner_id === ownerId,
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
    if (!ownerId && classId) {
      throw new InvalidResourceError()
    }

    const roomToUpdate = this.rooms.findIndex(
      (room) => room.owner_id === ownerId && room.id === classId,
    )

    if (roomToUpdate === -1) {
      throw new InvalidResourceError()
    }

    const currentRoom = this.rooms[roomToUpdate]

    const updatedRoomData: Class = {
      ...currentRoom,
      id: classId,
      owner_id: ownerId,
      class_number: (data.class_number as number) ?? currentRoom.class_number,
      capacity: (data?.capacity as number) ?? currentRoom.capacity,
      isAvaiable: (data?.isAvaiable as boolean) ?? currentRoom.isAvaiable,
      students: currentRoom.students,
    }

    this.rooms[roomToUpdate] = updatedRoomData

    return updatedRoomData
  }
}
