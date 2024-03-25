import { FastifyInstance } from 'fastify'
import { register } from './register'
import { getAllUsers } from './get-all-users'
import { deleteUser } from './delete'
import { getUserById } from './get-by-id'
import { updateUser } from './update'

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', register)
  app.get('/user/:userId', getUserById)
  app.put('/user/:userId', updateUser)
  app.get('/list/users', getAllUsers)
  app.delete('/user/:userId', deleteUser)
}
