import { knex, Knex } from 'knex';
import  {v4 as uuidv4} from 'uuid'

class userRepository {
    private db: Knex;

    constructor(db: Knex){
        this.db = db
    }

    async postCreateUser(expenseData: {
        username: string,
        password: string,
        session_id: string,
        balance: number,
    })
        {
            const id = uuidv4();

            return this.db('users').insert({
                id, ...expenseData
            })
        }
}

export default userRepository
