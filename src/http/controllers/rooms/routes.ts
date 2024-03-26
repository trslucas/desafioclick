import { FastifyInstance } from 'fastify'
import { register } from './register'
import { insertStudent } from './insert-student'
import { getRoomByTeacherId } from './get-rooms-by-teacher'
import { getRoomByStudentId } from './get-rooms-by-student'
import { removeStudent } from './remove-student'

export async function roomRoutes(app: FastifyInstance) {
  app.post('/rooms/create', register)
  app.post('/rooms/student', insertStudent)
  app.get('/rooms/teacher/:teacherId', getRoomByTeacherId)
  app.get('/rooms/student/:studentId', getRoomByStudentId)
  app.delete('/rooms/:classId/delete/student/:studentId', removeStudent)
}
