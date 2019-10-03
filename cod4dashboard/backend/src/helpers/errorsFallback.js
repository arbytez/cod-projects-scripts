const signale = require('../logger');

// catch all the unmanaged errors and stop script
process.on('uncaughtException', err => {
  signale.fatal(err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  signale.fatal(err);
  process.exit(1);
});
