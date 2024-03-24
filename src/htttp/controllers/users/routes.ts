import { FastifyInstance } from 'fastify'
import { register } from './register'
import { getAllUsers } from './get-all-users'
import { deleteUser } from './delete'

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', register)
  app.get('/list/users', getAllUsers)
  app.delete('/user/:userId', deleteUser)
}
