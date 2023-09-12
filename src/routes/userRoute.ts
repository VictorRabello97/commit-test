import { FastifyInstance } from "fastify"
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import { postCreateUsers } from "../controller/usersController"
import { userLogin } from "../controller/loginUserController"

export async function userRoutes(app: FastifyInstance) {

    app.post('/', { preHandler: [CheckSessionIdExist] }, async (request, reply) => {

        await postCreateUsers(request, reply)

    })

    app.post('/login', { preHandler: [CheckSessionIdExist] }, async (request, reply) => {

        await userLogin(request, reply)

    })
}