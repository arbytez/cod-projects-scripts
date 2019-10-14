// read env variables
require('./helpers/readEnvVars');

const signale = require('./logger');
signale.info(`script started in '${process.env.NODE_ENV}' mode!`);

// catch all the errors
require('./helpers/errorsFallback');

// start the update sqlitedb process
require('./sqlitedb/updateDb');

// start apollo graphql server
const server = require('./server/initServer');

module.exports = server;
