import { config } from "dotenv"

import { z } from 'zod'

if (process.env.NODE_ENV == 'test') {
    config({
        path: '.env.test'
    })
} else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),   //ENUM é informando que (é alguma dessas opções dentro do array)
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success == false) {
    console.error('Invalid variable', _env.error.format())
    throw new Error('Invalid variables data.')
}

export const env = _env.data
