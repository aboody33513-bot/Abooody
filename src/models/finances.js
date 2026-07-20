const { knex } = require('./db');

async function findByBatch(batch_id) {
  return knex('finances').where({ batch_id }).orderBy('recorded_at', 'desc');
}
async function findLatestByBatch(batch_id) {
  return knex('finances').where({ batch_id }).orderBy('recorded_at', 'desc').first();
}
async function create(fin) {
  const [id] = await knex('finances').insert(fin);
  return knex('finances').where({ id }).first();
}
async function update(id, patch) {
  await knex('finances').where({ id }).update(patch);
  return knex('finances').where({ id }).first();
}
async function remove(id) {
  return knex('finances').where({ id }).del();
}

module.exports = { findByBatch, findLatestByBatch, create, update, remove };
