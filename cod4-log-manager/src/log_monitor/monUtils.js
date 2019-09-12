const r = require('rethinkdb');

const { usersConfig, basicsConfig, readConfigs } = require('../config');
const { executeCommand } = require('../rcon');
const getRethinkDbConn = require('../db/rethinkDb');

exports.checkPermission = (guid, power) => {
  if (getPlayerPower(guid) < power) {
    executeCommand(`tell ${guid} ^1No permission for this command!`);
    return false;
  }
  return true;
};

exports.getPlayerPower = playerId => {
  const playerPower = usersConfig()[playerId] || { power: 1 };
  return playerPower.power;
};

exports.addOnlinePlayer = guid => {};
