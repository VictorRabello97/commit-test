import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('expenses', (table) => {
        table.uuid('id').primary()
        table.text('expenses_name').notNullable()
        table.text('image_path')
        table.decimal('value').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable
    })
}

export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('expenses')
}




