import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import {allExpenses, createExpenses, summaryOfAllExpenses, summaryOfSpecificExpense } from "../controller/expensesControllers";

export async function expensesRoute(app: FastifyInstance){
    
    app.post('/', async (request, reply) => {
        await createExpenses(request, reply)
    })

    app.get('/summary', {preHandler: [CheckSessionIdExist]}, async (request) => {
        const summary = await summaryOfAllExpenses(request)

        return summary

    })

    app.get('/summarySpecific', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        const summarySpecific = await summaryOfSpecificExpense(request, reply)

        return summarySpecific
    })

    app.get('/', {preHandler: [CheckSessionIdExist]},
    async (request, reply) => {

        const expense = await allExpenses(request, reply)
        return expense
    })

}
