const express = require('express');
const router = express.Router();
const { knex } = require('../models/db');

// simple reports endpoints and views
router.get('/age-over-45', async (req,res) => {
  const rows = await knex.raw(`
    SELECT c.client_id, c.name, b.id as batch_id, b.arrival_date,
      CAST(julianday('now') - julianday(b.arrival_date) AS INTEGER) as age_days
    FROM clients c JOIN batches b ON c.client_id=b.client_id
    WHERE (julianday('now') - julianday(b.arrival_date)) > 45
    ORDER BY age_days DESC
  `);
  res.render('reports/age_over_45', { title: 'العملاء بعمر >45', rows });
});

router.get('/client/:id', async (req,res) => {
  const clientId = req.params.id;
  const rows = await knex.raw(`
    SELECT b.*, f.cost_yer, f.revenue_yer, f.cost_usd, f.revenue_usd, f.recorded_at
    FROM batches b
    LEFT JOIN (
      SELECT * FROM finances f1 WHERE f1.recorded_at = (
        SELECT MAX(recorded_at) FROM finances f2 WHERE f2.batch_id = f1.batch_id
      )
    ) f ON f.batch_id = b.id
    WHERE b.client_id = ?
    ORDER BY b.arrival_date
  `, [clientId]);
  res.render('reports/client_account', { title: 'كشف حساب العميل', clientId, rows });
});

module.exports = router;
