const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let hackActive = false;

// Komut çalıştırma endpointi
app.post('/run', (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr || error.message);
    res.send(stdout || 'Komut çalıştırıldı, çıktı yok.');
  });
});

// Basit popup mesaj simülasyonu (Render’da gerçek popup olmaz, logla sadece)
app.post('/sendMessage', (req, res) => {
  const { message } = req.body;
  console.log('[Popup Mesaj]:', message);
  res.send('Mesaj konsola yazıldı.');
});

// Hack modu başlat (burada sadece flag tutuyoruz)
app.post('/startHack', (req, res) => {
  if (hackActive) return res.status(400).send('Hack modu zaten aktif.');
  hackActive = true;
  console.log('Hack modu başlatıldı.');
  res.send('Hack modu başlatıldı.');
});

// Hack modu durdur
app.post('/stopHack', (req, res) => {
  if (!hackActive) return res.status(400).send('Hack modu zaten kapalı.');
  hackActive = false;
  console.log('Hack modu kapatıldı.');
  res.send('Hack modu kapatıldı.');
});

// Statik dosyalar için
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Render uyumlu port ve host ayarı
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server ${HOST}:${PORT} portunda çalışıyor...`);
});
