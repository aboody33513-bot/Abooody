const path = require('path');
const fs = require('fs');
const knexLib = require('knex');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'poultry.db');
const DB_DIR = path.dirname(DB_FILE);
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const knex = knexLib({
  client: 'sqlite3',
  connection: {
    filename: DB_FILE
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, done) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }
});

async function initDbAndMigrations() {
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (t) => {
      t.increments('id');
      t.string('username').unique().notNullable();
      t.string('password_hash').notNullable();
      t.string('role').defaultTo('admin');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  const hasClients = await knex.schema.hasTable('clients');
  if (!hasClients) {
    await knex.schema.createTable('clients', (t) => {
      t.string('client_id').primary();
      t.string('name').notNullable();
      t.text('notes');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  const hasBatches = await knex.schema.hasTable('batches');
  if (!hasBatches) {
    await knex.schema.createTable('batches', (t) => {
      t.increments('id');
      t.string('client_id').notNullable();
      t.foreign('client_id').references('clients.client_id').onDelete('CASCADE');
      t.date('arrival_date').notNullable();
      t.integer('chicks_count').defaultTo(0);
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  const hasFinances = await knex.schema.hasTable('finances');
  if (!hasFinances) {
    await knex.schema.createTable('finances', (t) => {
      t.increments('id');
      t.integer('batch_id').notNullable();
      t.foreign('batch_id').references('batches.id').onDelete('CASCADE');
      t.decimal('cost_usd', 14, 2).defaultTo(0);
      t.decimal('cost_yer', 14, 2).defaultTo(0);
      t.decimal('revenue_usd', 14, 2).defaultTo(0);
      t.decimal('revenue_yer', 14, 2).defaultTo(0);
      t.timestamp('recorded_at').defaultTo(knex.fn.now());
      t.text('note');
    });
  }
  return;
}

module.exports = { knex, initDbAndMigrations };
