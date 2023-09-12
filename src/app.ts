import fastify from 'fastify'
import cookie from "@fastify/cookie"
import { projectsRoutes } from './routes/projects.js'
import { expensesRoute } from './routes/expenses.js'
import { userRoutes } from './routes/userRoute.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/indexEnv.js'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(cookie)

app.register(projectsRoutes, {
  prefix: 'projects'
})

app.register(expensesRoute, {
  prefix: 'expenses'
})

app.register(userRoutes, {
  prefix: 'users'
})