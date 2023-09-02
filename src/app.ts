import fastify from 'fastify'
import cookie from "@fastify/cookie"
import { projectsRoutes } from './routes/projects.js'
import { expensesRoute } from './routes/expenses.js'

export const app = fastify()

app.register(cookie)

app.register(projectsRoutes, {
  prefix: 'projects'
})

app.register(expensesRoute, {
  prefix: 'expenses'
})