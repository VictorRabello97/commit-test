import { FastifyInstance } from "fastify"
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import { postCreateUsers } from "../controller/usersController"

export async function userRoutes(app: FastifyInstance){

    app.post('/', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        await postCreateUsers(request, reply)

    })
}