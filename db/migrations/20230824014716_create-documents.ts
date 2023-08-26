import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary()    // criando tabelas no banco, definimos o tipo da coluna e o parametro passamos o nome
        table.text('title').notNullable()
        table.decimal('amount', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
}
)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

