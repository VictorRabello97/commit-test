import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import {knex} from "../database"
import { randomUUID } from "node:crypto"


export async function deleteTransaction(request: FastifyRequest, reply: FastifyReply){
    const getTransactionsParamsSchema = z.object({
        id: z.string().uuid()
    })

    const {sessionId} = request.cookies

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const transactions = await knex('transactions')
    .delete() 
    .where({
        session_id: sessionId,
        id: id
    })

    return transactions
}

export async function getAllTransaction(request: FastifyRequest){
    const {sessionId} = request.cookies

        const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()
        
        console.log("sessionId:", sessionId);

        return transactions
}

export async function getTransactionById(request: FastifyRequest){
    const getTransactionsParamsSchema = z.object({
            id: z.string().uuid()
        })

        const {sessionId} = request.cookies

        const { id } = getTransactionsParamsSchema.parse(request.params)
        
        const transactions = await knex('transactions')
        .where({
            session_id: sessionId,
            id: id
        })
        .first()


        return {transactions}
}

export async function getSummary(request: FastifyRequest){
    const {sessionId} = request.cookies
        

        const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', {as : 'amount'}).first()
        //SUM FAZ A SOMATÓRIA DA COLUNA, AS É PRA RENOMEAR NO RETORNO.

        return { summary } 
}

export async function createTransactions(request: FastifyRequest, reply: FastifyReply){
    const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),

        })

        const {title, amount, type} = createTransactionBodySchema
        .parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // days
            })
        }

        await knex('transactions')
        .insert({
            id: randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
            session_id: sessionId,
        })

        
}


