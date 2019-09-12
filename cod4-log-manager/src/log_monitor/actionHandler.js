const signale = require('../logger');
const { executeCommand } = require('../rcon');
const { basicsConfig } = require('../config');
const { commands, aliasesCmd } = require('./commands');

exports.joinAction = function(parts) {
  const [_, guid, pid, name] = parts;
  signale.debug(
    `Player guid '${guid}', pid: '${pid}', name: '${name}' joined.`
  );
};

exports.joinTeamAction = parts => {
  const [_, guid, pid, team, name] = parts;
  signale.debug(
    `Player guid '${guid}', pid: '${pid}', name: '${name}', team: '${team}' joined.`
  );
};

exports.quitAction = parts => {
  const [_, guid, pid, name] = parts;
  signale.debug(`Player guid '${guid}', pid: '${pid}', name: '${name}' quit.`);
};

exports.sayAction = parts => {
  const [_, guid, pid, name, msg] = parts;
  const regexp = new RegExp(
    `^${basicsConfig().daemon.cmdprefix}(\\S+)(\\s*)(.*)$`
  );
  const parsedCmd = regexp.exec(msg);
  if (parsedCmd) {
    const [_, cmdName, __, args] = parsedCmd;
    if (!commands[aliasesCmd[cmdName]]) {
      signale.debug(`Invalid command: '${cmdName}', arguments: '${args}'`);
      executeCommand(`tell ${guid} ^3Command not found!`);
    } else {
      commands[aliasesCmd[cmdName]].run({
        cmdArgs: args,
        guid,
        pid,
        playerName: name
      });
    }
  }
};

exports.nextMapAction = dvars => {
  // console.log('dvars', dvars);
  signale.debug(`Next map action`);
};

exports.mapEndAction = () => {
  signale.debug(`Map end action`);
};

exports.exitMapAction = () => {
  signale.debug(`Exit map action`);
};

exports.killAction = parts => {
  const [
    _,
    victim_guid,
    victim_pid,
    victim_team,
    victim_name,
    killer_guid,
    killer_pid,
    killer_team,
    killer_name,
    weapon,
    damage,
    image,
    bodypart
  ] = parts;
  signale.debug(`Kill action`, parts);
};

exports.damageAction = parts => {
  const [
    _,
    victim_guid,
    victim_pid,
    victim_team,
    victim_name,
    attacker_guid,
    attacker_pid,
    attacker_team,
    attacker_name,
    weapon,
    damage,
    image,
    bodypart
  ] = parts;
  signale.debug(`Damage action`, parts);
};

exports.vehicleDamageAction = parts => {
  const [
    _,
    entityid,
    vehicle_team,
    attacker_guid,
    attacker_pid,
    attacker_team,
    attacker_name,
    weapon,
    damage,
    image,
    bodypart
  ] = parts;
  signale.debug(`Vehicle damage action`, parts);
};

exports.actorsDamageAction = parts => {
  const [
    _,
    actor_id,
    actor_team,
    attacker_guid,
    attacker_pid,
    attacker_team,
    attacker_name,
    weapon,
    damage,
    image,
    bodypart
  ] = parts;
  signale.debug(`Actors damage action`, parts);
};

exports.resultAction = parts => {
  const [_, guid, pid, name] = parts;
  signale.debug(`Result action`, parts);
};

exports.actionAction = (action, parts) => {
  const [_, guid, pid, name] = parts;
  signale.debug(`Action action`, action, parts);
};
