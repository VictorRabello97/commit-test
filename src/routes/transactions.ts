import { FastifyInstance } from "fastify"
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import { createTransactions, getAllTransaction, getSummary, getTransactionById, deleteTransaction} from "../controller/transactionsControllers"



export async function transactionsRoutes(app: FastifyInstance){


    app.get('/summary', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const summary = await getSummary(request)
        return summary
    })

    app.get('/', {preHandler: [CheckSessionIdExist]},
    async (request) => {

        const transactions = await getAllTransaction(request)
        return transactions
    })

    app.get('/:id', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const transactionsId = await getTransactionById(request)
        return transactionsId
    })
    
    app.post('/', async (request, reply) => {

        await createTransactions(request, reply)

    })

    app.delete('/:id', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const deleteTransactions = await deleteTransaction(request, reply)
        
        return deleteTransactions

    })
}