exports.dbAll = (db, query) =>
  new Promise((resolve, reject) => {
    try {
      db.all(query, (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    } catch (error) {
      return reject(error);
    }
  });

exports.dbGet = (db, query) =>
  new Promise((resolve, reject) => {
    try {
      db.get(query, (err, row) => {
        if (err) return reject(err);
        return resolve(row);
      });
    } catch (error) {
      return reject(error);
    }
  });
