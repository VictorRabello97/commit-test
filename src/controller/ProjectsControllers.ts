import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import ProjectsRepository from "../repository/projectsRepository"


export async function getAllProjects(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify()

    console.log(request.user.sub)

    const { sub } = request.user

    const getAllProject = new ProjectsRepository(knex)

    const projects = getAllProject.getAllProjects(sub)

    return projects
}

export async function getProjectsByDateRange(request: FastifyRequest, reply: FastifyReply) {

    const getProjectsParamsSchema = z.object({
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    });

    await request.jwtVerify()

    console.log(request.user.sub)

    const { sub } = request.user




    const { startDate, endDate } = getProjectsParamsSchema.parse(request.query);

    const getProjectByDate = new ProjectsRepository(knex)

    const projectsByDate = getProjectByDate.getProjectsByDate(sub, startDate, endDate)

    return projectsByDate


}

export async function getProjectById(request: FastifyRequest, reply: FastifyReply) {
    const getTransactionsParamsSchema = z.object({
        id: z.string().uuid()
    })

    await request.jwtVerify()

    console.log(request.user.sub)

    const { sub } = request.user

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const getProjectId = new ProjectsRepository(knex)

    const projectId = getProjectId.getProjectsById(sub, id)

    return projectId
}

export async function SumOfProjects(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify()

    console.log(request.user.sub)

    const { sub } = request.user

    const balanceProject = new ProjectsRepository(knex)

    const sum = await balanceProject.getSummaryOfProjects(sub)

    return sum;

}

export async function createProject(request: FastifyRequest, reply: FastifyReply) {
    const createTransactionBodySchema = z.object({
        project_name: z.string(),
        client_name: z.string(),
        value: z.number(),
        its_paid: z.string(),
        person: z.string()

    })

    await request.jwtVerify()

    console.log(request.user.sub)

    const { sub } = request.user



    const { project_name, client_name, value, its_paid, person } = createTransactionBodySchema
        .parse(request.body)

    let sessionId = request.cookies.sessionId


    console.log(sessionId)

    if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7 // days
        })
    }

    const createProjects = new ProjectsRepository(knex)

    await createProjects.postCreateProject({
        project_name,
        client_name,
        value,
        its_paid,
        user_id: sub,
        session_id: sessionId,
        person,
    })

    return reply.code(201).send({ message: 'Project Created' });


}

export async function deleteProject(request: FastifyRequest, reply: FastifyReply) {
    const getTransactionsParamsSchema = z.object({
        id: z.string().uuid()
    })

    await request.jwtVerify()

    console.log(request.user.sub)

    const { sub } = request.user


    const { id } = getTransactionsParamsSchema.parse(request.params)

    const deleteProjects = new ProjectsRepository(knex)

    const deleteproject = await deleteProjects.deleteProjectById(sub, id)

    return deleteproject
}







