import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('projects', (table)=>{
        table.string('person').after('id').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('projects', (table)=>{
        table.dropColumn('person')
})
}

