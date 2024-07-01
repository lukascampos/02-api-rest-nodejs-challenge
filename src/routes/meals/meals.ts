import { FastifyInstance } from 'fastify'

import { randomUUID } from 'crypto'
import { knex } from '../../database'
import z from 'zod'
import { checkSessionIdExists } from '../../middlewares/check-sessionId-exists'
import { Users } from 'knex/types/tables'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: checkSessionIdExists }, async (req, rep) => {
    const { sessionId } = req.cookies

    const { id } = await knex('users').where({ session_id: sessionId }).first()

    const meals = await knex('meals')
      .where({ user_id: id })
      .orderBy('created_at', 'desc')

    return rep.send({ meals })
  })

  app.get(
    '/:mealId',
    { preHandler: checkSessionIdExists },
    async (req, rep) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(req.params)

      const { sessionId } = req.cookies

      const { id } = await knex('users')
        .where({ session_id: sessionId })
        .first()

      const meal = await knex('meals')
        .where({ user_id: id, id: mealId })
        .first()

      if (!meal) {
        return rep.status(404).send({ error: 'Meal not found' })
      }

      return rep.status(201).send({ meal })
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: checkSessionIdExists },
    async (req, rep) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(req.params)

      const { sessionId } = req.cookies

      const { id } = await knex('users')
        .where({ session_id: sessionId })
        .first()

      const meal = await knex('meals')
        .where({ user_id: id, id: mealId })
        .first()

      if (!meal) {
        return rep.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').delete().where({ user_id: id, id: mealId })

      return rep.status(204).send()
    },
  )

  app.post('/', { preHandler: checkSessionIdExists }, async (req, rep) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    })

    const body = createMealBodySchema.parse(req.body)

    const { sessionId } = req.cookies

    const { id }: Users = await knex('users')
      .select('*')
      .where({ session_id: sessionId })
      .first()

    await knex('meals').insert({
      id: randomUUID(),
      user_id: id,
      name: body.name,
      description: body.description,
      is_on_diet: body.is_on_diet,
    })

    return rep.status(201).send()
  })

  app.put(
    '/:mealId',
    { preHandler: checkSessionIdExists },
    async (req, rep) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(req.params)

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_diet: z.boolean(),
      })

      const body = updateMealBodySchema.parse(req.body)

      const { sessionId } = req.cookies

      const { id } = await knex('users')
        .where({ session_id: sessionId })
        .first()

      const meal = await knex('meals')
        .where({ user_id: id, id: mealId })
        .first()

      if (!meal) {
        return rep.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals')
        .update({
          name: body.name,
          description: body.description,
          is_on_diet: body.is_on_diet,
        })
        .where({ user_id: id, id: mealId })

      return rep.status(204).send()
    },
  )
}
