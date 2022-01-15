/**
 * Requirements:
 *   - npm install sjcl@1.0.6
 *   - npm install sqlite3
 *
 * Use like:
 *   node convert_db_to_html_file.js db.sqlite3 'super-secret-password'
 */

const fs = require('fs');
var path = require('path');

const sqlite3 = require('sqlite3').verbose();
const sjcl = require('sjcl');

function decrypt(password, encrypted) {
  return sjcl.decrypt(password, encrypted);
}

function fromEncryptedString(password, stringifiedEncrypted) {
  try {
    var encrypted = JSON.parse(stringifiedEncrypted);
  }
  catch(err) {
    console.error('Data is malformed and can not be decrypted.');
    return stringifiedEncrypted;
  }
  var decrypted = decrypt(password, encrypted);
  return decrypted;
}

function connectToDatabaseOnDisk(databaseFilename) {
  const db = new sqlite3.Database(databaseFilename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the ' + databaseFilename + ' database.');
  });
  return db;
}

function readDiaryEntries(db) {
  return new Promise((resolve, reject) => {
    const entries = [];
    db.all('SELECT * FROM entries_diaryentry ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        entries.push(row);
      });
      resolve(entries);
    });
  });
}

function closeDatabaseConnection(db) {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}


async function cli() {
  const databaseFilename = process.argv[2];
  const password = process.argv[3];

  const exportDir = 'idaho-export2';
  if (!fs.existsSync(exportDir)){
    fs.mkdirSync(exportDir, {recursive: true});
  }

  const db = connectToDatabaseOnDisk(databaseFilename);
  const entries = await readDiaryEntries(db);
  let html = '<ul>';

  for (const entry of entries) {

    if (entry.deleted) {
      continue;
    }

    const timestamp = Date.parse(entry.created_at);
    const date = new Date(timestamp);

    let title = 'no-title';
    let body = '';

    try {
      title = fromEncryptedString(password, entry.title);
    } catch (err) {
      title = '';
    }
    try {
      body = fromEncryptedString(password, entry.body);
    } catch (err) {
      body = '';
      console.log('ERROR with ' + entry.created_at);
      continue;
    }

    const formattedDate = date.toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');

    console.log(formattedDate);

    html += '<li>';
    html += '<h2>' + formattedDate + '</h2>';
    html += '<h3>' + title + '</h3>';
    if (entry.kind == 'text') {
      html += '<p>' + body + '</p>';
    }
    else if (entry.kind == 'audio') {
      html += '<audio controls src="' + body + '"/>';
    }
    else if (entry.kind == 'image') {
      html += '<img src="' + body + '"/>';
    }
    html += '</li>';

    // let ext = '.txt';
    // if (entry.kind == 'image') {
    //   ext = '.jpg';
    // }
    // else if (entry.kind == 'audio') {
    //   ext = '.ogg';
    // }

    // let filename = `${entry.created_at}_id-${entry.id}_usr-${entry.author_id}_${entry.kind}__${title}`;
    // filename = filename.replace(/[^a-z0-9äöüßÄÜÖ]/gi, '_').toLowerCase() + ext;
    // filename = path.join(exportDir, filename);
    // fs.writeFileSync(filename, body);
  }

  html += '</ul>';
  fs.writeFileSync(path.join(exportDir, 'idaho.html'), html);
}

cli();
