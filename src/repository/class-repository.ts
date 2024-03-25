import { Class, Prisma } from '@prisma/client'

export interface ClassRepository {
  create(data: Prisma.ClassCreateInput): Promise<Class>
  findById(userId: string): Promise<Class[] | null>
  insertStudent(ownerId: string, studentId: string): Promise<Class | null>
  removeStudent(ownerId: string, studentId: string): Promise<void>
  listStudentsByRoom(ownerId: string, classId: string): Promise<Class | null>
  deleteClassRoom(ownerId: string, classId: string): Promise<void>
  getClassRoomsByStudent(studentId: string): Promise<Class[] | null>
}
