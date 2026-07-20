const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'poultry.db');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '..', '..', 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

router.get('/', (req,res) => {
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.db') || f.endsWith('.sqlite'));
  res.render('backup/index', { title: 'نسخ احتياطي', files });
});

router.get('/download', (req,res) => {
  if (!fs.existsSync(DB_FILE)) return res.status(404).send('DB not found');
  const name = `backup-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.db`;
  res.download(DB_FILE, name);
});

router.post('/restore', (req,res) => {
  // simple restore via file upload is not implemented here (use direct file replace)
  res.send('استخدم تحميل الملف واستبداله يدوياً');
});

module.exports = router;
