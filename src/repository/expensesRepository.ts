import { knex, Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';




class ExpenseRepository {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async getSpecificSummary(sessionId: string, name: string) {
    return this.db('expenses')
      .where('session_id', sessionId)
      .where('expenses_name', name)
      .sum('value', { as: 'Summary' })
      .first();
  }

  async postCreateExpense(expenseData: {
    expenses_name: string,
    image_path: string,
    session_id: string,
    value: number
  }) {
    const id = uuidv4();
    await this.db('expenses').insert({
      id, ...expenseData
    });

    console.log('aaaaaaaaaaaaaaa')

    const user = await this.db('users').where({session_id: expenseData.session_id})
    .first()

    console.log(user)

    if (user){
      await this.db('users')
      .where({id: user.id})
      .update({balance: user.balance + expenseData.value})

      console.log('Saldo após a atualização:', user.balance);

    }
    
    return user
    

  }

  async getSummaryOfAllExpenses(sessionId: string){
    return this.db('expenses')
    .where('session_id', sessionId)
    .sum('value', {as: 'Summary of all values'})
    .first()
  }

  async getListOfAllExpenses(sessionId: string){
    return this.db('expenses')
    .where('session_id', sessionId)
    .select()
  }
}

export default ExpenseRepository;