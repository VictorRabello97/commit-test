import { test, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from "supertest"

describe('Transactions Routes', () => {
    
    beforeAll( async () => {
        await app.ready()
    
    })
    
    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })
    
    test('Deve ser possivel fazer uma nova transação', async () => {
        await request(app.server)
            .post('/transactions').send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
    
        .expect(201)
    })

    test('Deve ser possivel listar todas as transações', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions').send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
    
            const cookies = createTransactionResponse.get('Set-Cookie')

           const listTransactionsResponse = await request (app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            
            .expect(200)

            console.log(listTransactionsResponse.body)

            expect(listTransactionsResponse.body).toEqual([
                expect.objectContaining({
                    title: 'New Transaction',
                    amount: 5000,
                })
            ])
    })

    test('Deve ser possivel listar uma transação especifica', async () => {
        const listTransactionId = await request(app.server)
            .post('/transactions').send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })

    
            const cookies = listTransactionId.get('Set-Cookie')

           const listTransactionsResponse = await request (app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

            const transactionId = listTransactionsResponse.body[0].id

            console.log(`AAAAAAAAAAAAAAAAAAAAA ${transactionId}`)
            
            const getTransactionRespone = await request (app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

            expect(getTransactionRespone.body.transactions).toEqual(
                expect.objectContaining({
                    title: 'New Transaction',
                    amount: 5000,
                })
            )
    })

    test('Deve ser possivel listar o saldo das atualizações com base no usuario (validado por cookie)', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions').send({
                title: 'Credit Transaction',
                amount: 5000,
                type: 'credit'
            })
    
            const cookies = createTransactionResponse.get('Set-Cookie')

            await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                
                title: 'Debit Transaction',
                amount: 2000,
                type: 'debit'
            })

           const summaryResponse = await request (app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            
            .expect(200)

            console.log(summaryResponse.body)

            expect(summaryResponse.body.summary).toEqual({
                amount: 3000
            })
    })

    })

