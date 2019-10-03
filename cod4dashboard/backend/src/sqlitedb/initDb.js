const fs = require('fs');
const sqlite3 = require('sqlite3');

if (!fs.existsSync(process.env.SQLITEDB_TO_PATH)) {
  fs.writeFileSync(process.env.SQLITEDB_TO_PATH, '');
}

const sqlitedb = new sqlite3.Database(
  process.env.SQLITEDB_TO_PATH,
  sqlite3.OPEN_READONLY,
  err => {
    if (err) throw err;
  }
);

module.exports = sqlitedb;
