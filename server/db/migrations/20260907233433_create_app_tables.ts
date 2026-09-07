import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table
        .increments('id').primary();
      table
        .string('username');
      table
        .string('password_hash')
        .notNullable();
      table
        .timestamps(true, true);
    })
    .createTable('villagers', (table) => {
      table
        .increments('id')
        .primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .string('name')
        .notNullable();
      table
        .integer('friendship_points')
        .defaultTo(25);
      table
        .boolean('is_on_island')
        .defaultTo(true);
      table
        .boolean('is_last_moved_in')
        .defaultTo(false);
      table
        .boolean('is_relocating')
        .defaultTo(false);
      table
        .boolean('asked_last_to_move')
        .defaultTo(false);
      table
        .string('icon_url');
    })
    .createTable('clothing_inventory', (table) => {
      table
        .increments('id')
        .primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .string('name')
        .notNullable();
      table
        .string('color_1');
      table
        .string('color_2');
      table
        .string('style_1');
      table
        .string('style_2');
      table
        .string('icon_url');
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('clothing_inventory')
    .dropTableIfExists('villagers')
    .dropTableIfExists('users');
}

