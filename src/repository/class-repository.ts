import { Class, Prisma } from '@prisma/client'

export interface ClassRepository {
  create(data: Prisma.ClassCreateInput): Promise<Class>
  findById(userId: string): Promise<Class | null>
  insertStudent(ownerId: string, studentId: string): Promise<Class | null>
  removeStudent(ownerId: string, studentId: string): Promise<void>
}
