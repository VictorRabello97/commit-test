import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod'
import { knex } from "../database"
import * as bcrypt from 'bcrypt';
import userRepository from "../repository/userRepository";




export async function userLogin(request: FastifyRequest, reply: FastifyReply) {
  const createSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const { username, password } = createSchema.parse(request.body);

  const login = new userRepository(knex);

  const user = await login.checkUser({
    username,
    password
  });

  const token = await reply.jwtSign({}, {
    sign: {
      sub: user?.id
    }
  })

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      reply.code(200).send({ token });
    } else {
      reply.code(401).send({ message: 'wrong password' });
    }
  } else {
    reply.code(401).send({ message: 'user not found' });
  }
}















