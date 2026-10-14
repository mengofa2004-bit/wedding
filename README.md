# 💍 Wedding Invitation Website

## 🇷🇺 Русская версия

Сайт-приглашение на свадьбу, которая состоялась **20 декабря 2025 года**.

Это одностраничный лендинг для информирования гостей и сбора RSVP-ответов.

### ✨ Возможности:

- 📅 Дата свадьбы: 20.12.2025
- 💌 Форма обратной связи для гостей
- 🧑‍🤝‍🧑 Гость вводит ФИО и выбирает статус:
  - Приду  
  - Не смогу присутствовать  
- 📊 Отправка данных в Google Sheets  
- ⚙️ Интеграция через Google Apps Script  

### 🛠 Технологии

- HTML  
- CSS  
- JavaScript (frontend)  
- Google Apps Script (backend)  
- Google Sheets  

### 📦 Google Apps Script (backend)

```javascript
function doPost(e) {
  try {
    // Парсим JSON из POST-запроса
    var data = JSON.parse(e.postData.contents);

    // Получаем таблицу
    var spreadsheetId = "тут guid гугл-таблицы";
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Лист1");

    // Преобразуем объект в массив в порядке столбцов
    var row = [
      data.last_name || "",
      data.first_name || "",
      data.note || "",
      data.will_come || false
    ];

    // Записываем в конец таблицы
    sheet.appendRow(row);

    // Отправляем ответ
    return ContentService
             .createTextOutput(JSON.stringify({status: "success"}))
             .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
             .createTextOutput(JSON.stringify({status: "error", message: error.message}))
             .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("PING");
}

```
## Онлайн демо

🔗 [https://1r1shmann.github.io/wedding](https://1r1shmann.github.io/wedding "Открыть сайт")

# 💍 Wedding Invitation Website

## 🇬🇧 English version

A wedding invitation website for an event was scheduled on **December 20, 2025**.

This is a simple single-page landing page used to inform guests and collect RSVP responses.

### ✨ Features

- 📅 Wedding date: December 20, 2025  
- 💌 RSVP form for guests  
- 🧑‍🤝‍🧑 Guests enter full name and select status:
  - Will attend  
  - Cannot attend  
- 📊 Responses are stored in Google Sheets  
- ⚙️ Google Apps Script integration  

### 🛠 Technologies

- HTML  
- CSS  
- JavaScript (frontend)  
- Google Apps Script (backend)  
- Google Sheets  

### 📦 Google Apps Script (backend)

```javascript
function doPost(e) {
  try {
    // Parsing JSON from a POST Request
    var data = JSON.parse(e.postData.contents);

    // Get a table
    var spreadsheetId = "here is the google spreadsheet guid";
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Sheet1");

    // Convert the object into an array in column order.
    var row = [
      data.last_name || "",
      data.first_name || "",
      data.note || "",
      data.will_come || false
    ];

    // Append to the end of the table.
    sheet.appendRow(row);

    // Sending response
    return ContentService
             .createTextOutput(JSON.stringify({status: "success"}))
             .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
             .createTextOutput(JSON.stringify({status: "error", message: error.message}))
             .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("PING");
}

```
## Live Demo

🔗 [https://1r1shmann.github.io/wedding](https://1r1shmann.github.io/wedding "View site")
