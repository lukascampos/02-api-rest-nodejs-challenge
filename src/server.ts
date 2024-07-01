import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { usersRoutes } from './routes/users/users'
import { mealsRoutes } from './routes/meals/meals'

const app = fastify()

app.register(cookie)
app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('server running')
  })
