import { FastifyInstance } from "fastify"
import { CheckJWT } from "../middleweres/checkJWT"
import { postCreateUsers } from "../controller/createUserController.js"
import { userLogin } from "../controller/loginUserController"

export async function userRoutes(app: FastifyInstance) {

    app.post('/', async (request, reply) => {

        await postCreateUsers(request, reply)

    })

    app.post('/login', async (request, reply) => {

        await userLogin(request, reply)

    })
}