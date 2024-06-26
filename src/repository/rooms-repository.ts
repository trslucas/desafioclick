import { Class, Prisma } from '@prisma/client'

export interface RoomsRepository {
  create(data: Prisma.ClassCreateInput): Promise<Class>
  findById(userId: string): Promise<Class[] | null>
  insertStudent(
    ownerId: string,
    studentId: string,
    classId: string,
  ): Promise<Class | null>
  removeStudent(
    ownerId: string,
    studentId: string,
    classId: string,
  ): Promise<void>
  listStudentsByRoom(ownerId: string, classId: string): Promise<Class | null>
  deleteClassRoom(ownerId: string, classId: string): Promise<void>
  getClassRoomsByStudent(studentId: string): Promise<Class[] | null>
  updateRoom(
    ownerId: string,
    classId: string,
    data: Prisma.ClassUpdateInput,
  ): Promise<Class>
}
