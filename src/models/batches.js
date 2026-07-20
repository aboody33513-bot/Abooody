const { knex } = require('./db');

async function listByClient(client_id) {
  return knex('batches').where({ client_id }).orderBy('arrival_date', 'desc');
}
async function findById(id) {
  return knex('batches').where({ id }).first();
}
async function create(batch) {
  const [id] = await knex('batches').insert(batch);
  return findById(id);
}
async function update(id, patch) {
  await knex('batches').where({ id }).update(patch);
  return findById(id);
}
async function remove(id) {
  return knex('batches').where({ id }).del();
}

module.exports = { listByClient, findById, create, update, remove };
