const r = require('rethinkdb');

const signale = require('../logger');
const getRethinkDbConn = require('./rethinkDb');
const { basicsConfig } = require('../config');

const initDb = async () => {
  try {
    const connDb = await getRethinkDbConn();
    // check if db/tables already exist otherwise create one
    const dbList = await r.dbList().run(connDb);
    if (!dbList.includes(basicsConfig().database.dbname)) {
      await r.dbCreate(basicsConfig().database.dbname).run(connDb);
      signale.complete(`Db '${basicsConfig().database.dbname}' created.`);
    }
    const tableList = await r
      .db(basicsConfig().database.dbname)
      .tableList()
      .run(connDb);
    if (!tableList.includes('status')) {
      await r
        .db(basicsConfig().database.dbname)
        .tableCreate('status')
        .run(connDb);
      signale.complete(`Table 'status' created.`);
    }
    if (!tableList.includes('players')) {
      await r
        .db(basicsConfig().database.dbname)
        .tableCreate('players')
        .run(connDb);
      signale.complete(`Table 'players' created.`);
    }
    if (!tableList.includes('users')) {
      await r
        .db(basicsConfig().database.dbname)
        .tableCreate('users')
        .run(connDb);
      signale.complete(`Table 'users' created.`);
    }
  } catch (error) {
    signale.error(error);
    process.exit(1);
  }
};

module.exports = initDb;
