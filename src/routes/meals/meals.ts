import { FastifyInstance } from 'fastify'

import { randomUUID } from 'crypto'
import { knex } from '../../database'
import z from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, rep) => {
    const createMealBodySchema = z.object({
      user_id: z.string(),
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    })

    const body = createMealBodySchema.parse(req.body)

    if (!body.user_id) {
      return rep.status(400).send('user_id required')
    }

    await knex('meals').insert({
      id: randomUUID(),
      user_id: body.user_id,
      name: body.name,
      description: body.description,
      is_on_diet: body.is_on_diet,
    })

    return rep.status(201).send()
  })
}
