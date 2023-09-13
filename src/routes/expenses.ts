import { FastifyInstance } from "fastify";
import { CheckJWT } from "../middleweres/checkJWT.js"
import { getAllExpenses, postCreateExpense, getAllSummary, getSummaryOfSpecificExpense } from "../controller/expensesControllers";

export async function expensesRoute(app: FastifyInstance) {

    app.post('/', { preHandler: [CheckJWT] }, async (request, reply) => {
        await postCreateExpense(request, reply)
    })

    app.get('/summary', { preHandler: [CheckJWT] }, async (request) => {
        const summary = await getAllSummary(request)

        return summary

    })

    app.get('/summarySpecific', { preHandler: [CheckJWT] }, async (request, reply) => {
        const summarySpecific = await getSummaryOfSpecificExpense(request, reply)

        return summarySpecific
    })

    app.get('/', { preHandler: [CheckJWT] },
        async (request, reply) => {

            const expense = await getAllExpenses(request, reply)
            return expense
        })

}
