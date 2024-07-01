import 'dotenv/config'
import { envSchema } from '../@types/env/env'

export const env: envSchema = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV!,
  PORT: 3333,
}
