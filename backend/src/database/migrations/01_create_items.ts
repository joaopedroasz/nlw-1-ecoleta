import Knex, { CreateTableBuilder } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('items', (table: CreateTableBuilder): void => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('image').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('items');
}
