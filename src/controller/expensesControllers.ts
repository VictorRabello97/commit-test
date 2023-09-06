import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import {knex} from "../database"
import { randomUUID } from "node:crypto"
import ExpenseRepository from "../repository/expensesRepository"

export async function postCreateExpense(request: FastifyRequest, reply:FastifyReply){
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

        const expenseRepository = new ExpenseRepository(knex);

        await expenseRepository.postCreateExpense({
          expenses_name,
          image_path,
          session_id: sessionId,
          value,
        });
            
        return reply.code(201).send({ message: 'Expense Created' });
      } catch (error) {
        return reply.code(400).send({ message: 'Error', error });
      }
    }



export async function getAllSummary(request: FastifyRequest){
        const { sessionId } = request.cookies
    
        if (sessionId === undefined) {
            throw new Error('Session ID not found');
          }
        
        const summaryRepository = new ExpenseRepository(knex)
    
        const summary = await summaryRepository.getSummaryOfAllExpenses(sessionId)
    
    
        return summary
        
    }
    


export async function getSummaryOfSpecificExpense(request: FastifyRequest, reply: FastifyReply){

    const createSchema = z.object({
        name: z.string()
    })

    const { sessionId } = request.cookies

    if (sessionId === undefined) {
        throw reply.code(404).send('Unauthorized ')
      }
    
    const { name } = createSchema.parse(request.query)
    
    const specificRepository = new ExpenseRepository(knex)
    
    const summary = specificRepository.getSpecificSummary(sessionId, name)
    
    return summary

  }

  
       
export async function getAllExpenses(request: FastifyRequest, reply: FastifyReply){
    const {sessionId} = request.cookies
    
    const expensesRepository = new ExpenseRepository(knex)

    if (sessionId === undefined) {
        throw reply.code(404).send('Unauthorized ')
      }

    const listOffAllExpanses = expensesRepository.getListOfAllExpenses(sessionId)
    
    return listOffAllExpanses
  }
    
        





