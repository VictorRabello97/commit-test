import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod';
import userRepository from "../repository/userRepository";
import { knex } from "../database";
import { randomUUID } from "crypto";



export async function postCreateUsers(request: FastifyRequest, reply: FastifyReply) {

    const createSchema = z.object({
        username: z.string(),
        password: z.string(),
        balance: z.number().default(0)
    })

    const { username, password, balance} = createSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7 // days
        })
    }


    const postUsers = new userRepository(knex)

    await postUsers.postCreateUser({
        username,
        password,
        session_id: sessionId,
        balance
    })

    return reply.code(201).send({ message: 'user created' })
}