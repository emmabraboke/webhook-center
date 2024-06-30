import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('projects', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('description');
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('business_id')
        .references('id')
        .inTable('business')
        .onDelete('CASCADE');

      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('projects');
}
