import { Class, Prisma } from '@prisma/client'
import { ClassRepository } from '../class-repository'
import { randomUUID } from 'crypto'
import { InvalidUserError } from '../../use-cases/errors/invalid-user-id-error'

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

    this.rooms.push(room)

    return room
  }

  async findById(userId: string) {
    if (!userId) {
      throw new InvalidUserError()
    }

    const room = this.rooms.find((item) => item.owner_id === userId)

    if (!room) {
      return null
    }

    return room
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

    const studentIndex = room?.students.findIndex(
      (student) => student.id === studentId,
    )

    if (studentIndex === -1) {
      throw new Error('Student not found in the room')
    }

    room?.students.splice(Number(studentIndex), 1)
  }
}
