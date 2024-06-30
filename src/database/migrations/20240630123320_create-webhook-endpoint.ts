import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('webhook_endpoints', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('url').notNullable();
      table.string('name').notNullable();
      table
        .uuid('project_id')
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('webhook_endpoints');
}
