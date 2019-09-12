const sqlite3 = require('sqlite3');

const sqlitedb = new sqlite3.Database(
  process.env.SQLITEDB_PATH,
  sqlite3.OPEN_READONLY,
  err => {
    if (err) throw err;
  }
);

module.exports = sqlitedb;
