const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

// Логируем где лежат файлы (для отладки)
console.log('__dirname:', __dirname);
console.log('index.html exists:', fs.existsSync(path.join(__dirname, 'index.html')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── RSVP API — должен быть ДО статики ──
app.post('/api/rsvp', async (req, res) => {
  try {
    const { name, will_come } = req.body;

    if (!name || !will_come) {
      return res.json({ status: 'error', message: 'Не заполнены обязательные поля' });
    }

    if (!SCRIPT_URL) {
      return res.json({ status: 'error', message: 'GOOGLE_SCRIPT_URL не задан на сервере' });
    }

    const params = new URLSearchParams();
    params.append('name',      name.trim());
    params.append('will_come', will_come.trim());

    const response = await fetch(SCRIPT_URL, {
      method:   'POST',
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:     params.toString(),
      redirect: 'follow'
    });

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error('RSVP error:', err);
    return res.json({ status: 'error', message: 'Ошибка сервера: ' + err.message });
  }
});

// ── Статика: css, js, images, fonts ──
app.use('/css',    express.static(path.join(__dirname, 'css')));
app.use('/js',     express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fonts',  express.static(path.join(__dirname, 'fonts')));

// ── Все остальные запросы → index.html ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Wedding server running on port ${PORT}`);
});
