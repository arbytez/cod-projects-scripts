const r = require('rethinkdb');

const signale = require('./logger');
const pubsub = require('./pubsub');
const { serverStatus } = require('./rcon');
const getRethinkDbConn = require('./db/rethinkDb');
const { basicsConfig } = require('./config');

let intervalId = null;

const startBackgroundWorker = function() {
  if (intervalId) stopBackgroundWorker();
  intervalId = setInterval(cb, basicsConfig().daemon.backgroundworkerinterval);
};

const stopBackgroundWorker = function() {
  clearInterval(intervalId);
};

async function cb() {
  try {
    const connDb = await getRethinkDbConn();
    const status = await serverStatus();
    const statusRecords = await (await r
      .db(basicsConfig().database.dbname)
      .table('status')
      .run(connDb)).toArray();
    if (statusRecords.length === 0) {
      await r
        .db(basicsConfig().database.dbname)
        .table('status')
        .insert(status)
        .run(connDb);
    } else if (statusRecords.length > 0) {
      await r
        .db(basicsConfig().database.dbname)
        .table('status')
        .get(statusRecords[0].id)
        .replace({ ...status, id: statusRecords[0].id })
        .run(connDb);
    }
    pubsub.publish('status', {
      status
    });
  } catch (error) {
    signale.error(error);
    stopBackgroundWorker();
    process.exit(1);
  }
}

exports.startBackgroundWorker = startBackgroundWorker;
exports.stopBackgroundWorker = stopBackgroundWorker;
