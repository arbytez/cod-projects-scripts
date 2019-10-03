const Client = require('ssh2').Client;

const signale = require('../logger');
const { formatDuration } = require('../helpers/utils');

// download the sqlitedb via sftp
const updateDb = () => {
  const conn = new Client();
  signale.await(`connecting via ssh to ${process.env.SSH_SERVER}...`);
  conn
    .on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) throw err;
        signale.pending(
          `copying db from ${process.env.SQLITEDB_FROM_PATH} to ${process.env.SQLITEDB_TO_PATH}...`
        );
        sftp.fastGet(
          process.env.SQLITEDB_FROM_PATH,
          process.env.SQLITEDB_TO_PATH,
          async err => {
            if (err) throw err;
            signale.complete('db copied!');
            conn.end();
          }
        );
      });
    })
    .connect({
      host: process.env.SSH_SERVER,
      port: process.env.SSH_PORT,
      username: process.env.SSH_USER,
      password: process.env.SSH_PASSWORD
    });
};

// update db the first time
updateDb();

// set interval to keep db updated
setInterval(updateDb, +process.env.UPDATE_DB_INTERVAL);
signale.info(
  `every ${formatDuration(
    +process.env.UPDATE_DB_INTERVAL
  )} the sqlitedb will be updated.`
);
