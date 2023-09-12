import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('expenses', (table) => {
        table.string('user_id').after('id').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('expenses', (table) => {
        table.dropColumn('user_id')
    })
}
