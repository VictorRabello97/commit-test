import { knex, Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';




class ExpenseRepository {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async getSpecificSummary(sub: string, name: string) {
    return this.db('expenses')
      .where('user_id', sub)
      .where('expenses_name', name)
      .sum('value', { as: 'Summary' })
      .first();
  }

  async postCreateExpense(expenseData: {
    expenses_name: string,
    image_path: string,
    user_id: string,
    session_id: string,
    value: number
  }) {
    const id = uuidv4();
    await this.db('expenses').insert({
      id, ...expenseData
    });

    const user = await this.db('users').where({ id: expenseData.user_id })
      .first()

    console.log(user)

    if (user) {
      await this.db('users')
        .where({ id: user.id })
        .update({ balance: user.balance - expenseData.value })

    }

    return user


  }

  async getSummaryOfAllExpenses(sub: string) {
    return this.db('expenses')
      .where('user_id', sub)
      .sum('value', { as: 'Summary of all values' })
      .first()
  }

  async getListOfAllExpenses(sub: string) {
    return this.db('expenses')
      .where('user_id', sub)
      .select()
  }
}

export default ExpenseRepository;