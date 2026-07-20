const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });
const XLSX = require('xlsx');
const { knex } = require('../models/db');

// simple import: expects columns: client_id,name,arrival_date,chicks_count,cost_yer,revenue_yer
router.get('/', (req,res) => {
  res.render('import/index', { title: 'استيراد' });
});
router.post('/upload', upload.single('file'), async (req,res) => {
  if(!req.file) return res.redirect('/import');
  const wb = XLSX.readFile(req.file.path);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const trx = await knex.transaction();
  try {
    for (const row of data) {
      const client_id = String(row.client_id || row.id || '').trim();
      if (!client_id) continue;
      const name = row.name || 'غير معروف';
      await trx('clients').where({ client_id }).first().then(async (ex)=>{
        if (ex) {
          await trx('clients').where({ client_id }).update({ name, notes: ex.notes });
        } else {
          await trx('clients').insert({ client_id, name });
        }
      });
      // optional create batch
      if (row.arrival_date) {
        const arrival = new Date(row.arrival_date);
        const chicks = row.chicks_count || 0;
        const [bId] = await trx('batches').insert({ client_id, arrival_date: arrival.toISOString().slice(0,10), chicks_count: chicks });
        if (row.cost_yer || row.revenue_yer || row.cost_usd || row.revenue_usd) {
          await trx('finances').insert({ batch_id: bId, cost_yer: row.cost_yer||0, revenue_yer: row.revenue_yer||0, cost_usd: row.cost_usd||0, revenue_usd: row.revenue_usd||0 });
        }
      }
    }
    await trx.commit();
  } catch (e) {
    await trx.rollback();
    console.error('Import error', e);
  }
  res.redirect('/clients');
});

module.exports = router;
