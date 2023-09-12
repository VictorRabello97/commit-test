import { FastifyInstance } from "fastify";
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import { getAllExpenses, postCreateExpense, getAllSummary, getSummaryOfSpecificExpense } from "../controller/expensesControllers";

export async function expensesRoute(app: FastifyInstance) {

    app.post('/', async (request, reply) => {
        await postCreateExpense(request, reply)
    })

    app.get('/summary', { preHandler: [CheckSessionIdExist] }, async (request) => {
        const summary = await getAllSummary(request)

        return summary

    })

    app.get('/summarySpecific', { preHandler: [CheckSessionIdExist] }, async (request, reply) => {
        const summarySpecific = await getSummaryOfSpecificExpense(request, reply)

        return summarySpecific
    })

    app.get('/', { preHandler: [CheckSessionIdExist] },
        async (request, reply) => {

            const expense = await getAllExpenses(request, reply)
            return expense
        })

}
