import fastify from 'fastify'

import { ZodError } from 'zod'
import { env } from './env'
import { userRoutes } from './http/controllers/users/routes'
import { roomRoutes } from './http/controllers/rooms/routes'

export const app = fastify()

app.register(userRoutes)
app.register(roomRoutes)
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  }

  reply.status(500).send({ message: 'Internal Server Error' })
})
