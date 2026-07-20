const express = require('express');
const router = express.Router();
const Clients = require('../models/clients');

router.get('/', async (req,res) => {
  res.redirect('/clients');
});

router.get('/health', (req,res) => res.json({ ok: true }));

module.exports = router;
