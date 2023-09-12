import { FastifyInstance } from "fastify"
import { CheckJWT } from "../middleweres/checkJWT"
import { createProject, getAllProjects, SumOfProjects, getProjectById, deleteProject, getProjectsByDateRange } from "../controller/ProjectsControllers.js"



export async function projectsRoutes(app: FastifyInstance) {


    app.get('/balance', { preHandler: [CheckJWT] }, async (request, reply) => {

        const balance = await SumOfProjects(request, reply)
        return balance
    })

    app.get('/', { preHandler: [CheckJWT] },
        async (request, reply) => {

            const getAll = await getAllProjects(request, reply)
            return getAll
        })

    app.get('/data', { preHandler: [CheckJWT] }, async (request, reply) => {
        const getByDate = await getProjectsByDateRange(request, reply)
        return getByDate
    })

    app.get('/:id', { preHandler: [CheckJWT] }, async (request, reply) => {

        const getById = await getProjectById(request, reply)
        return getById
    })

    app.post('/', async (request, reply) => {

        await createProject(request, reply)

    })

    app.delete('/:id', { preHandler: [CheckJWT] }, async (request, reply) => {

        const deleteProjects = await deleteProject(request, reply)

        return deleteProjects

    })
}