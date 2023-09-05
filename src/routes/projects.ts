import { FastifyInstance } from "fastify"
import { CheckSessionIdExist } from "../middleweres/checkSessionIdExist"
import { createProject, getAllProjects, balanceOfProjects, getProjectById, deleteProject, getProjectsByDateRange} from "../controller/ProjectsControllers.js"



export async function projectsRoutes(app: FastifyInstance){


    app.get('/balance', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const balance = await balanceOfProjects(request, reply)
        return balance
    })

    app.get('/', {preHandler: [CheckSessionIdExist]},
    async (request, reply) => {

        const getAll = await getAllProjects(request, reply)
        return getAll
    })

    app.get('/data',  {preHandler: [CheckSessionIdExist]}, async (request, reply)=>{
        const getByDate = await getProjectsByDateRange(request, reply)
        return getByDate
    })

    app.get('/:id', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const getById = await getProjectById(request, reply)
        return getById
    })
    
    app.post('/', async (request, reply) => {

        await createProject(request, reply)

    })

    app.delete('/:id', {preHandler: [CheckSessionIdExist]}, async (request, reply) => {
        
        const deleteProjects = await deleteProject(request, reply)
        
        return deleteProjects

    })
}