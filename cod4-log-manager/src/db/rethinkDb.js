const r = require('rethinkdb');

const signale = require('../logger');
const { basicsConfig } = require('../config');

let rethinkDbConn = null;

const getRethinkDbConn = async () => {
  try {
    if (rethinkDbConn) return rethinkDbConn;
    rethinkDbConn = await r.connect({
      host: basicsConfig().database.hostname,
      port: basicsConfig().database.port
    });
    signale.info(
      `RethinkDb connection established on '${
        basicsConfig().database.hostname
      }:${basicsConfig().database.port}'`
    );
    return rethinkDbConn;
  } catch (error) {
    signale.error(error);
    process.exit(1);
  }
};

module.exports = getRethinkDbConn;
