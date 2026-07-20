const express = require('express');
const router = express.Router();
const { knex } = require('../models/db');

router.get('/', async (req,res) => {
  const totalClients = await knex('clients').count('* as c').first();
  const totalBatches = await knex('batches').count('* as b').first();
  const ageThreshold = parseInt(process.env.ALERT_AGE_DAYS || '45', 10);
  const alerts = await knex.raw(`
    SELECT c.client_id, c.name, b.id as batch_id, b.arrival_date,
      CAST(julianday('now') - julianday(b.arrival_date) AS INTEGER) as age_days
    FROM clients c JOIN batches b ON c.client_id=b.client_id
    WHERE (julianday('now') - julianday(b.arrival_date)) >= ?
    ORDER BY age_days DESC
    LIMIT 50
  `, [ageThreshold]);
  res.render('dashboard', {
    title: 'لوحة التحكم',
    totalClients: totalClients.c,
    totalBatches: totalBatches.b,
    alerts: alerts
  });
});

module.exports = router;
