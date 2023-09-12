import { knex, Knex } from 'knex';
import  {v4 as uuidv4} from 'uuid'
import * as bcrypt from 'bcrypt';

class userRepository {
    private db: Knex;

    constructor(db: Knex){
        this.db = db
    }

    async postCreateUser(userData: {
        username: string,
        password: string,
        session_id: string,
        balance: number,
    })
        {
            const id = uuidv4();

            const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 é o custo de hashing

            return this.db('users').insert({
                id, ...userData,
                password: hashedPassword
            })
        }

        async checkUser(loginData: {
            username: string,
            password: string,
        }) {
            const user = await this.db('users')
              .select()
              .where('username', loginData.username)
              .first();

              return user || null       
        }}
        


export default userRepository
