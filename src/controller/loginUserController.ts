import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod'
import {knex} from "../database"
import * as bcrypt from 'bcrypt';
import userRepository from "../repository/userRepository";
import { randomUUID } from "crypto";




export async function userLogin(request: FastifyRequest, reply: FastifyReply) {
    const createSchema = z.object({
      username: z.string(),
      password: z.string(),
    });

    let sessionId = request.cookies.sessionId

        if (!sessionId){
            sessionId = randomUUID()

            reply.cookie('session_id', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 //7days
            })
        }

  
    const { username, password } = createSchema.parse(request.body);
  
    const login = new userRepository(knex);
  
    const user = await login.checkUser({
      username,
      password,
      session_id: sessionId
    });
  
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        reply.code(200).send({ message: 'Login bem-sucedido' });
      } else {
        reply.code(401).send({ message: 'Senha incorreta' });
      }
    } else {
      reply.code(401).send({ message: 'Usuário não encontrado' });
    }
  }
    
  

  
    
    
    
    
    
    
    

