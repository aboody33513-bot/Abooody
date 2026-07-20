const { knex } = require('./db');

async function listAll(filter = {}) {
  const q = knex('clients');
  if (filter.q) {
    q.whereRaw('(client_id LIKE ? OR name LIKE ?)', [`%${filter.q}%`, `%${filter.q}%`]);
  }
  q.orderBy('created_at', 'desc');
  return q;
}
async function findById(client_id) {
  return knex('clients').where({ client_id }).first();
}
async function createOrUpdate(client) {
  const exists = await findById(client.client_id);
  if (exists) {
    await knex('clients').where({ client_id: client.client_id }).update({
      name: client.name,
      notes: client.notes || null
    });
    return findById(client.client_id);
  } else {
    await knex('clients').insert({
      client_id: client.client_id,
      name: client.name,
      notes: client.notes || null
    });
    return findById(client.client_id);
  }
}
async function remove(client_id) {
  return knex('clients').where({ client_id }).del();
}

module.exports = { listAll, findById, createOrUpdate, remove };
