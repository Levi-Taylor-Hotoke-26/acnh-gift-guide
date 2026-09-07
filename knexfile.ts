import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './server/db/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './server/db/seeds',
      extension: 'ts'
    }
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './server/db/migrations',
      extension: 'ts'
    }
  }
};

export default config;