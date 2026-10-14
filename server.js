const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Google Apps Script URL — берётся из переменной окружения Railway
const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

// Парсим тело запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздаём статику (html, css, js, images)
app.use(express.static(path.join(__dirname)));

// ── RSVP API ──────────────────────────────────────────────
// Фронтенд отправляет POST /api/rsvp
// Сервер проксирует запрос в Google Apps Script
// Гостям VPN не нужен — запрос идёт с сервера Railway
app.post('/api/rsvp', async (req, res) => {
  try {
    const { name, will_come } = req.body;

    if (!name || !will_come) {
      return res.json({ status: 'error', message: 'Не заполнены обязательные поля' });
    }

    if (!SCRIPT_URL) {
      return res.json({ status: 'error', message: 'GOOGLE_SCRIPT_URL не задан на сервере' });
    }

    // Формируем тело запроса для Google Apps Script
    const params = new URLSearchParams();
    params.append('name',      name.trim());
    params.append('will_come', will_come.trim());

    const response = await fetch(SCRIPT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
      // Следуем редиректам (Google Apps Script делает редирект)
      redirect: 'follow'
    });

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error('RSVP error:', err);
    return res.json({ status: 'error', message: 'Ошибка сервера: ' + err.message });
  }
});

// Все остальные GET → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Wedding server running on port ${PORT}`);
});
