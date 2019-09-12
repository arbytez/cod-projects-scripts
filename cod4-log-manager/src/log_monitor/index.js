const fs = require('fs');
const Tail = require('tail').Tail; // https://github.com/lucagrulla/node-tail

const signale = require('../logger');
const pubsub = require('../pubsub');
const {
  joinAction,
  joinTeamAction,
  quitAction,
  sayAction,
  nextMapAction,
  killAction,
  damageAction,
  vehicleDamageAction,
  actorsDamageAction,
  resultAction,
  actionAction,
  exitMapAction,
  mapEndAction
} = require('./actionHandler');
const { getLogEventAction, parseParts } = require('./parserUtils');
const { basicsConfig } = require('../config');
const { executeCommand } = require('../rcon');

const tail = new Tail(basicsConfig().connection.logpath, {
  useWatchFile: true,
  fsWatchOptions: { interval: 200 }
});

fs.appendFileSync(
  basicsConfig().connection.logpath,
  `\n----------------------------JSManager started ${new Date().toLocaleString()}----------------------------\n`
);

// must fast_restart server otherwise log is not read until server starts to write to logfile
executeCommand('fast_restart');

signale.await(
  `Monitoring started for file '${basicsConfig().connection.logpath}'`
);
executeCommand('say ^1JSManager is watching the server!');

tail.on('line', function(data) {
  let action = 'unknown';
  let line = '';
  let parts = [];
  const parsedData = data.match(/^\s*(\d+):(\d{2})\s*(.*)$/);
  if (parsedData) {
    line = parsedData[3];
    action = getLogEventAction(line);
    parts = parseParts(line, action);
  }
  // signale.debug('action:', action);
  // signale.debug('parts:', parts);
  switch (action) {
    case 'join':
      joinAction(parts);
      break;
    case 'jointeam':
      joinTeamAction(parts);
      break;
    case 'quit':
      quitAction(parts);
      break;
    case 'say':
    case 'sayteam':
      sayAction(parts);
      break;
    case 'nextmap':
      nextMapAction(parts);
      break;
    case 'exitmap':
      exitMapAction();
      break;
    case 'mapend':
      mapEndAction();
      break;
    case 'kill':
      killAction(parts);
      break;
    case 'damage':
      damageAction(parts);
      break;
    case 'vehicledamage':
      vehicleDamageAction(parts);
      break;
    case 'actordamage':
      actorsDamageAction(parts);
      break;
    case 'tie':
    case 'win':
    case 'loss':
      resultAction(parts);
      break;
    case 'action':
      actionAction(action, parts);
      break;
    default:
      break;
  }
  pubsub.publish('log_event', {
    logEvent: {
      action,
      from: '',
      to: '',
      weapon: '',
      bodyPart: '',
      damageType: '',
      fromTeam: '',
      toTeam: ''
    }
  });
});

tail.on('error', function(error) {
  signale.error(error);
});

module.exports = tail;
