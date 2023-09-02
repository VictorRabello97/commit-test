import { FastifyInstance } from "fastify"
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import { createProject, getAllTransaction, balanceOfProjects, getProjectById, deleteProject, getProjectsByDateRange} from "../controller/ProjectsControllers.js"



export async function projectsRoutes(app: FastifyInstance){


    app.get('/balance', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const summary = await balanceOfProjects(request)
        return summary
    })

    app.get('/', {preHandler: [CheckSessionIdExist]},
    async (request) => {

        const transactions = await getAllTransaction(request)
        return transactions
    })

    app.get('/data',  {preHandler: [CheckSessionIdExist]}, async (request)=>{
        const projec = await getProjectsByDateRange(request)
        return projec
    })

    app.get('/:id', {preHandler: [CheckSessionIdExist]}, async (request) => {
        
        const transactionsId = await getProjectById(request)
        return transactionsId
    })
    
    app.post('/', async (request, reply) => {

        await createProject(request, reply)

    })

    app.delete('/:id', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const deleteTransactions = await deleteProject(request, reply)
        
        return deleteTransactions

    })
}