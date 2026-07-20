const express = require('express');
const router = express.Router();
const Finances = require('../models/finances');

router.get('/:batchId', async (req,res) => {
  const entries = await Finances.findByBatch(req.params.batchId);
  res.render('finances/list', { title: 'القيود المالية', entries, batchId: req.params.batchId });
});
router.post('/:batchId/new', async (req,res) => {
  const { cost_usd, cost_yer, revenue_usd, revenue_yer, note } = req.body;
  await Finances.create({ batch_id: req.params.batchId, cost_usd: cost_usd||0, cost_yer: cost_yer||0, revenue_usd: revenue_usd||0, revenue_yer: revenue_yer||0, note });
  res.redirect(`/finances/${req.params.batchId}`);
});

module.exports = router;
