/**
 * Google Apps Script для свадебного сайта Георгия и Анастасии
 * Принимает POST-запросы с формы и записывает данные в Google Sheets
 *
 * Инструкция по деплою — см. README.md в этой папке
 */

// ID вашей Google Таблицы (берётся из URL таблицы)
// Пример URL: https://docs.google.com/spreadsheets/d/ЗДЕСЬ_ID/edit
var SPREADSHEET_ID = 'ВСТАВЬТЕ_ID_ТАБЛИЦЫ_СЮДА';

// Название листа в таблице
var SHEET_NAME = 'Ответы гостей';

/**
 * Обрабатывает POST-запрос с сайта
 */
function doPost(e) {
  try {
    var name     = (e.parameter.name      || '').trim();
    var willCome = (e.parameter.will_come || '').trim();

    // Базовая валидация
    if (!name || !willCome) {
      return jsonResponse({ status: 'error', message: 'Не заполнены обязательные поля' });
    }

    var sheet = getOrCreateSheet();

    // Добавляем строку: дата, имя, статус
    var now = Utilities.formatDate(new Date(), 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss');
    sheet.appendRow([now, name, willCome]);

    return jsonResponse({ status: 'success' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Обрабатывает GET-запрос (нужен для CORS-preflight от браузера)
 */
function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Wedding RSVP Script is running' });
}

/**
 * Возвращает лист, создаёт его при первом запуске
 */
function getOrCreateSheet() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Создаём заголовки колонок
    sheet.appendRow(['Дата и время', 'ФИО гостя', 'Статус']);

    // Форматирование заголовка
    var header = sheet.getRange(1, 1, 1, 3);
    header.setFontWeight('bold');
    header.setBackground('#F14E95');
    header.setFontColor('#ffffff');
    header.setHorizontalAlignment('center');

    // Ширина колонок
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 240);
    sheet.setColumnWidth(3, 200);
  }

  return sheet;
}

/**
 * Формирует JSON-ответ с нужными CORS-заголовками
 */
function jsonResponse(data) {
  var output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
