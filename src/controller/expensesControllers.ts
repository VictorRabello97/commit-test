import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import {knex} from "../database"
import { randomUUID } from "node:crypto"

export async function createExpenses(request: FastifyRequest, reply:FastifyReply){
    const createExpenseSchema = z.object({
        expenses_name: z.string(),
        image_path: z.string(),
        value: z.number()
    })

    try {
        const {expenses_name, image_path, value} = 
        createExpenseSchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId){
            sessionId = randomUUID()

            reply.cookie('session_id', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 //7days
            })
        }

        await knex('expenses')
        .insert({
            id: randomUUID(),
            expenses_name,
            image_path,
            session_id: sessionId,
            value,
        })
        return reply.code(201).send({message: 'Expense Created'})
    } catch (error) {
        return reply.code(400).send({message: 'Error', error})
    }

}

export async function specificExpense(request: FastifyRequest){
    const createExpenseSchema = z.object({
        name: z.string(),
    })

    const { sessionId } = request.cookies

    try{
        const { name } = createExpenseSchema.parse(request.query);

        const specificExpense = await knex('expenses')
        .where('expenses_name', name)
        .where('session_id', sessionId)
        .select()
        
        return specificExpense
    } catch (error) {
        throw new Error('Expenses not found')
    }
}

export async function summaryOfAllExpenses(request: FastifyRequest){
    const { sessionId } = request.cookies

    
    const summary = await knex('expenses')
    .where('session_id', sessionId)
    .sum('value', {as : 'summary of values'}).first()

    return summary

  
       
    

}

export async function summaryOfSpecificExpense(request: FastifyRequest, reply: FastifyReply){

    const createSchema = z.object({
        name: z.string()
    })

    const { sessionId } = request.cookies

    const { name } = createSchema.parse(request.query)

    const summary = await knex('expenses')
    .where('session_id', sessionId)
    .where('expenses_name', name)
    .sum('value', {as: 'Summary'}).first()

    return summary

}

export async function allExpenses(request: FastifyRequest){
    const {sessionId} = request.cookies
    
    const expense = await knex('expenses')
    .where('session_id', sessionId)
    .select()
    
    console.log("sessionId:", sessionId);

        return expense
}