import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import {knex} from "../database"
import { randomUUID } from "node:crypto"
import ProjectsRepository from "../repository/projectsRepository"


export async function getAllProjects(request: FastifyRequest, reply: FastifyReply){
   
    const {sessionId} = request.cookies

    if (sessionId === undefined) {
        throw reply.code(404).send('Unauthorized')
      }

    const getAllProject = new ProjectsRepository(knex)

    const projects = getAllProject.getAllProjects(sessionId)
    
    return projects
    }
    
export async function getProjectsByDateRange(request: FastifyRequest, reply: FastifyReply) {
        const { sessionId } = request.cookies;
        
        const getProjectsParamsSchema = z.object({
            startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        });
    
        if (sessionId === undefined) {
            throw reply.code(404).send('Unauthorized')
          }
    
        
            const { startDate, endDate } = getProjectsParamsSchema.parse(request.query);
    
            const getProjectByDate = new ProjectsRepository(knex)
    
            const projectsByDate = getProjectByDate.getProjectsByDate(sessionId, startDate, endDate)
    
            return projectsByDate
    
      
    }

export async function getProjectById(request: FastifyRequest, reply: FastifyReply){
    const getTransactionsParamsSchema = z.object({
        id: z.string().uuid()
    })
    
    const {sessionId} = request.cookies

    if (sessionId === undefined) {
        throw reply.code(404).send('Unauthorized')
      }
    
    const { id } = getTransactionsParamsSchema.parse(request.params)

    const getProjectId = new ProjectsRepository(knex)

    const projectId  = getProjectId.getProjectsById(sessionId, id)

    return projectId
    }

export async function balanceOfProjects(request: FastifyRequest, reply: FastifyReply){
    const {sessionId} = request.cookies

    if (sessionId === undefined) {
        throw reply.code(404).send('Unauthorized')
      }
    
    const balanceProject = new ProjectsRepository(knex)

    const balance = await balanceProject.getBalanceOfProjects(sessionId)

    return balance;
    
    }

export async function createProject(request: FastifyRequest, reply: FastifyReply){
        const createTransactionBodySchema = z.object({
            project_name: z.string(),
            client_name: z.string(),
            value: z.number(),
            its_paid: z.string(),
            person: z.string()

        })

        
        const {project_name, client_name, value, its_paid, person} = createTransactionBodySchema
        .parse(request.body)
        
        let sessionId = request.cookies.sessionId

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
            session_id: sessionId,
            person,
        })

        return reply.code(201).send({ message: 'Project Created' });


    } 
        
export async function deleteProject(request: FastifyRequest, reply: FastifyReply){
            const getTransactionsParamsSchema = z.object({
                id: z.string().uuid()
            })
        
            const {sessionId} = request.cookies

            if (sessionId === undefined) {
                throw reply.code(404).send('Unauthorized')
              }
        
            const { id } = getTransactionsParamsSchema.parse(request.params)
        
            const deleteProjects = new ProjectsRepository(knex)

            const deleteproject = await deleteProjects.deleteProjectById(sessionId, id)

            return deleteproject
    }






    
    