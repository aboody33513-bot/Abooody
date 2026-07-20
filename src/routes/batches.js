const express = require('express');
const router = express.Router();
const Clients = require('../models/clients');
const Batches = require('../models/batches');
const Finances = require('../models/finances');

router.get('/', async (req,res) => {
  const q = req.query.q || '';
  const clients = await Clients.listAll({ q });
  res.render('clients/list', { title: 'العملاء', clients, q });
});

router.get('/new', async (req,res) => {
  res.render('clients/form', { title: 'إضافة عميل', client: {} });
});
router.post('/new', async (req,res) => {
  const { client_id, name, notes } = req.body;
  await Clients.createOrUpdate({ client_id, name, notes });
  res.redirect('/clients');
});
router.get('/:id/edit', async (req,res) => {
  const client = await Clients.findById(req.params.id);
  if (!client) return res.redirect('/clients');
  res.render('clients/form', { title: 'تعديل عميل', client });
});
router.post('/:id/edit', async (req,res) => {
  const { name, notes } = req.body;
  await Clients.createOrUpdate({ client_id: req.params.id, name, notes });
  res.redirect('/clients');
});
router.post('/:id/delete', async (req,res) => {
  await Clients.remove(req.params.id);
  res.redirect('/clients');
});

// client batches
router.get('/:id/batches', async (req,res) => {
  const client = await Clients.findById(req.params.id);
  if(!client) return res.redirect('/clients');
  const batches = await Batches.listByClient(req.params.id);
  // fetch latest finance for each batch
  const withFin = [];
  for (const b of batches) {
    const fin = await Finances.findLatestByBatch(b.id);
    withFin.push({ batch: b, finance: fin });
  }
  res.render('clients/batches', { title: 'دفعات العميل', client, batches: withFin });
});

router.get('/:id/batches/new', async (req,res) => {
  const client = await Clients.findById(req.params.id);
  if(!client) return res.redirect('/clients');
  res.render('clients/new_batch', { title: 'إضافة دفعة', client });
});
router.post('/:id/batches/new', async (req,res) => {
  const { arrival_date, chicks_count } = req.body;
  const batch = await Batches.create({ client_id: req.params.id, arrival_date, chicks_count });
  res.redirect(`/clients/${req.params.id}/batches`);
});

module.exports = router;
