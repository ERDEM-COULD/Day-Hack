const express = require('express');
const path = require('path');
const { exec, spawn } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let hackProcess = null;

// Komut çalıştırma endpointi
app.post('/run', (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr || error.message);
    res.send(stdout || 'Komut çalıştırıldı, çıktı yok.');
  });
});

// Popup mesaj gönderme endpointi - popup-top.ps1 ile
app.post('/sendMessage', (req, res) => {
  const { message } = req.body;
  const scriptPath = path.join(__dirname, 'popup-top.ps1');

  const ps = spawn('powershell.exe', [
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-Message', message
  ]);

  ps.on('error', (err) => {
    console.error('PowerShell çalıştırma hatası:', err);
    res.status(500).send('Mesaj gösterilemedi.');
  });

  ps.on('exit', (code) => {
    if (code === 0) {
      res.send('Mesaj gösterildi.');
    } else {
      res.status(500).send('Mesaj gösterilemedi, PowerShell hatası.');
    }
  });
});

// Hacklenme başlat endpointi
app.post('/startHack', (req, res) => {
  if (hackProcess) return res.status(400).send('Hacklenme zaten açık.');

  const scriptPath = path.join(__dirname, 'popup-hack.ps1');
  hackProcess = spawn('powershell.exe', [
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-Message', 'HACKLENIYORSUN!',
    '-Delay', '300'
  ]);

  hackProcess.stdout.on('data', data => console.log('Hack stdout:', data.toString()));
  hackProcess.stderr.on('data', data => console.error('Hack stderr:', data.toString()));

  hackProcess.on('close', (code) => {
    console.log('Hack process kapandı, kod:', code);
    hackProcess = null;
  });

  res.send('Hacklenme modu başlatıldı.');
});

// Hacklenme durdur endpointi
app.post('/stopHack', (req, res) => {
  if (!hackProcess) return res.status(400).send('Hacklenme zaten kapalı.');
  hackProcess.kill();
  hackProcess = null;
  res.send('Hacklenme modu kapatıldı.');
});

const PORT = 3000;
const HOST = '192.168.1.153';
app.listen(PORT, HOST, () => console.log(`Server ${HOST}:${PORT} portunda çalışıyor...`));
