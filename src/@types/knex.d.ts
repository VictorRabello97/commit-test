import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        projects: {
            id: string,
            project_name: string,
            client_name: string,
            value: number,
            its_paid: string,
            person: string,
            user_id: string,
            created_at: string,
            session_id?: string
        }

        expenses: {
            id: string,
            expenses_name: string,
            image_path: string,
            value: number,
            user_id: string,
            created_at: string,
            session_id?: string
        }

        users: {
            id: string,
            username: string,
            password: string,
            balance: number,
            session_id?: string,
        }
    }
}


