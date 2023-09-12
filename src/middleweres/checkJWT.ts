import { FastifyReply, FastifyRequest } from "fastify"

export async function CheckJWT(request: FastifyRequest, reply: FastifyReply) {

    const token  = await request.jwtVerify()

    if (!token){
        return reply.status(401).send({message: 'Unauthorized'})
    }
}