// read env variables
require('./helpers/readEnvVars');

// catch all the not managed errors
require('./helpers/errorsFallback');

// start listening commands
require('./runCmds');
