import 'dotenv/config'

import {z} from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'text', 'production']).default('production'),   //ENUM é informando que (é alguma dessas opções dentro do array)
    DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success == false) {
    console.error('Invalid variable', _env.error.format())
    throw new Error('Invalid variables data.')
}

export const env = _env.data
