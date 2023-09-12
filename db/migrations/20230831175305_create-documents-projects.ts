import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('projects', (table) => {
        table.uuid('id').primary()    // criando tabelas no banco, definimos o tipo da coluna e o parametro passamos o nome
        table.text('project_name').notNullable()
        table.text('client_name').notNullable()
        table.decimal('value', 10, 2).notNullable();
        table.text('its_paid')
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('projects')
}