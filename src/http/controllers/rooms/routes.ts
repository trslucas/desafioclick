import { FastifyInstance } from 'fastify'
import { register } from './register'
import { insertStudent } from './insert-student'

export async function roomRoutes(app: FastifyInstance) {
  app.post('/rooms/create', register)
  app.post('/rooms/student', insertStudent)
}
