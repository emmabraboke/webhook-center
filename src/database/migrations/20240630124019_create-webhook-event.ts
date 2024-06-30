import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('webhook_events', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.integer('retries').defaultTo(0);
      table.dateTime('next_retry');
      table.jsonb('payload').notNullable();
      table.jsonb('headers').notNullable();
      table.string('status');
      table
        .uuid('endpoint_id')
        .references('id')
        .inTable('webhook_endpoints')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('webhook_events');
}
