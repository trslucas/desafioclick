import { FastifyInstance } from 'fastify'
import { register } from './register'
import { insertStudent } from './insert-student'
import { getRoomByTeacherId } from './get-rooms-by-teacher'
import { getRoomByStudentId } from './get-rooms-by-student'
import { removeStudent } from './remove-student'
import { updateRoom } from './update-room'
import { getStudentsByRoom } from './get-students-by-room'
import { deleteRoom } from './delete-room'

export async function roomRoutes(app: FastifyInstance) {
  app.post('/rooms/create', register)
  app.post('/rooms/student', insertStudent)
  app.get('/rooms/teacher/:teacherId', getRoomByTeacherId)
  app.get('/rooms/student/:studentId', getRoomByStudentId)
  app.get('/rooms/students/:teacherId/room/:classId', getStudentsByRoom)
  app.put('/rooms/teacher/:teacherId/update/:classId', updateRoom)
  app.delete('/rooms/:classId/delete/student/:studentId', removeStudent)
  app.delete('/rooms/teacher/:teacherId/delete/:classId', deleteRoom)
}
