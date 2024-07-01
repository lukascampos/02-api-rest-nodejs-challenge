import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../../database'

import z from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*')

    return { users }
  })

  app.post('/', async (req, rep) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const body = createUserBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      rep.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name: body.name,
      session_id: sessionId,
    })

    return rep.status(201).send()
  })
}
