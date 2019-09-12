const signale = require('../logger');
const { usersConfig, basicsConfig, readConfigs } = require('../config');
const { executeCommand } = require('../rcon');
const { checkPermission, getPlayerPower } = require('./monUtils');

const commands = {
  cmd: {
    minPower: 1,
    run: args => {
      const { cmdArgs, guid, pid, playerName } = args;
      if (checkPermission(guid, commands.cmd.minPower)) {
        let reply = '';
        Object.keys(commands)
          .sort()
          .forEach(cmd => {
            reply += `${basicsConfig().daemon.cmdprefix}${cmd} `;
          });
        executeCommand(`tell ${guid} ${reply}`);
      }
    }
  },
  me: {
    minPower: 1,
    run: args => {
      const { cmdArgs, guid, pid, playerName } = args;
      if (checkPermission(guid, commands.me.minPower)) {
        executeCommand(
          `say My name is ^3${playerName} ^7and my id is ^3${guid}^7!`
        );
      }
    }
  },
  aliases: {
    minPower: 30,
    run: args => {
      const { cmdArgs, guid, pid, playerName } = args;
      if (checkPermission(guid, commands.aliases.minPower)) {
        executeCommand(`tell ${guid} TODO`);
      }
    }
  },
  players: {
    minPower: 30,
    run: args => {
      const { cmdArgs, guid, pid, playerName } = args;
      if (checkPermission(guid, commands.players.minPower)) {
        executeCommand(`tell ${guid} TODO`);
      }
    }
  },
  ss: {
    minPower: 30,
    run: args => {
      const { cmdArgs, guid, pid, playerName } = args;
      if (checkPermission(guid, commands.ss.minPower)) {
        executeCommand(`tell ${guid} TODO`);
      }
    }
  },
  config: {
    minPower: 80,
    run: args => {
      const { cmdArgs, guid, pid, playerName } = args;
      if (checkPermission(guid, commands.config.minPower)) {
        readConfigs();
        executeCommand(`say ^2Config read!`);
      }
    }
  }
};

const aliasesCmd = {
  me: 'me',
  whoami: 'me',
  aliases: 'aliases',
  al: 'aliases',
  players: 'players',
  pl: 'players',
  ss: 'ss',
  cmd: 'cmd',
  commands: 'cmd',
  cmds: 'cmd',
  help: 'cmd',
  cmdlist: 'cmd',
  config: 'config',
  cfg: 'config'
};

exports.getPlayerPower = getPlayerPower;
exports.aliasesCmd = aliasesCmd;
exports.commands = commands;
