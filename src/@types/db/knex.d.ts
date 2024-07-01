// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Users {
    users: {
      id: string
      name: string
      created_at: string
      session_id?: string
    }
  }

  export interface Meals {
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      is_on_diet: boolean
      created_at: string
      session_id?: string
    }
  }
}
