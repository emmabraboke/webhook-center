import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('first_name');
      table.string('last_name');
      table.string('email').unique().notNullable();
      table.string('phone_number');
      table.string('profile_image');
      table.string('role');
      table.string('password');
      table.boolean('verified').defaultTo(false);
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
