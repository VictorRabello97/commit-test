import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import {knex} from "../database"
import { randomUUID } from "node:crypto"



export async function getAllTransaction(request: FastifyRequest){
   
    const {sessionId} = request.cookies

    console.log(request.body)

    
    const projects = await knex('projects')
    .where('session_id', sessionId)
    .select()
    
    console.log("sessionId:", sessionId);
    
        return projects
}



export async function getProjectsByDateRange(request: FastifyRequest) {
    const { sessionId } = request.cookies;
    
    const getProjectsParamsSchema = z.object({
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    });

    try {
        const { startDate, endDate } = getProjectsParamsSchema.parse(request.query);

        const projects = await knex('projects')
            .where('session_id', sessionId)
            .whereBetween('created_at', [startDate, endDate])
            .select();

        return projects;
    } catch (error) {
        console.error('no project for selected data:', error);
        throw new Error('no project for selected data');
    }
}

export async function getProjectById(request: FastifyRequest){
    const getTransactionsParamsSchema = z.object({
        id: z.string().uuid()
    })
    
    const {sessionId} = request.cookies
    
    const { id } = getTransactionsParamsSchema.parse(request.params)

    
        const projects = await knex('projects')
        .where({
            session_id: sessionId,
            id: id
        })
        .first()

        
        return {projects}
}

export async function balanceOfProjects(request: FastifyRequest){
    const {sessionId} = request.cookies
    
    
    const summary = await knex('projects')
    .where('session_id', sessionId)
        .sum('value', {as : 'summary of values'}).first()
        //SUM FAZ A SOMATÓRIA DA COLUNA, AS É PRA RENOMEAR NO RETORNO.
        
        return { summary } 
}

export async function createProject(request: FastifyRequest, reply: FastifyReply){
        const createTransactionBodySchema = z.object({
            project_name: z.string(),
            client_name: z.string(),
            value: z.number(),
            its_paid: z.string(),
            person: z.string()

        })

        
        try { 
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
        
        await knex('projects')
        .insert({
            id: randomUUID(),
            project_name,
            client_name,
            value,
            its_paid,
            person,
            session_id: sessionId,
        })

    return reply.code(201).send({ message: 'Project created' });
        } catch (error) {
            console.error("Error creating project:", error);

            return reply.code(400).send({message: 'Error', error});
        }
    } 
        
export async function deleteProject(request: FastifyRequest, reply: FastifyReply){
            const getTransactionsParamsSchema = z.object({
                id: z.string().uuid()
            })
        
            const {sessionId} = request.cookies
        
            const { id } = getTransactionsParamsSchema.parse(request.params)
        
            const transactions = await knex('projects')
            .delete() 
            .where({
                session_id: sessionId,
                id: id
            })
        
            return transactions
}


    
    