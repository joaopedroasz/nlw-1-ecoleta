import Knex, { CreateTableBuilder } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'point_items',
    (table: CreateTableBuilder): void => {
      table.increments('id').primary();

      table
        .integer('collection_point_id')
        .notNullable()
        .references('id')
        .inTable('collection_points');

      table.integer('item_id').notNullable().references('id').inTable('items');
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('point_items');
}
