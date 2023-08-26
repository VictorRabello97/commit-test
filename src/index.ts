import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'crypto'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await knex('transactions').insert({   //inserindo .select('*')) puxando do banco tudo o que está cadastrado
    id: randomUUID(),
    title: 'Transação teste',
    amount: 1000,

  })
  .returning('*')
  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running! 🎉')
  })