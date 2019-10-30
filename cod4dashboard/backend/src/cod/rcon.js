const dgram = require('dgram');
const iconv = require('iconv-lite');

const signale = require('../logger');

function createCommand(command, rcon) {
  let cmd = '';
  if (rcon) {
    cmd = `rcon ${process.env.COD4_RCON} ${command}`;
  } else {
    cmd = `${command}`;
  }
  const bufferTemp = iconv.encode(cmd, 'ascii');
  const bufferSend = new Uint8Array(bufferTemp.length + 5);
  bufferSend[0] = iconv.encode('255', 'ascii');
  bufferSend[1] = iconv.encode('255', 'ascii');
  bufferSend[2] = iconv.encode('255', 'ascii');
  bufferSend[3] = iconv.encode('255', 'ascii');
  bufferSend[4] = iconv.encode('02', 'ascii');
  let j = 4;
  for (let i = 0; i < bufferTemp.length; i++) {
    bufferSend[j++] = bufferTemp[i];
  }
  bufferSend[bufferSend.Length - 1] = iconv.encode('00', 'ascii');
  return bufferSend;
}

const sendUdpMessage = (
  message,
  host,
  port,
  instantPrint,
  rcon,
  maxTimeOut = 1000
) => {
  return new Promise((resolve, reject) => {
    try {
      let out = '';
      let socket = dgram.createSocket('udp4');
      socket.send(createCommand(message, rcon), port, host);
      socket.on('message', (incomingMessage, rinfo) => {
        const res = Buffer.from(incomingMessage)
          .toString()
          .replace('����print', '')
          .replace('����infoResponse', '')
          .replace('����statusResponse', '')
          .replace('\n', '');
        out += res;
        if (instantPrint) signale.log(res);
      });
      setTimeout(() => {
        socket.close();
        socket = null;
        resolve(out);
      }, maxTimeOut);
    } catch (error) {
      signale.error(`Error: ${error.message}`);
      reject(error.message);
    }
  });
};

const executeRconCommand = async (
  command,
  maxTimeOut = 1000,
  instantPrint = false
) => {
  const res = await sendUdpMessage(
    command,
    process.env.COD4_SERVER_IP,
    process.env.COD4_SERVER_PORT,
    instantPrint,
    true,
    maxTimeOut
  );
  return res;
};

const executeCommand = async (
  command,
  maxTimeOut = 1000,
  instantPrint = false
) => {
  const res = await sendUdpMessage(
    command,
    process.env.COD4_SERVER_IP,
    process.env.COD4_SERVER_PORT,
    instantPrint,
    false,
    maxTimeOut
  );
  return res;
};

const serverStatus = async (getFullInfo = false) => {
  let res = await getStatus(300);
  let status = {
    online: !!res,
    ip: process.env.COD4_SERVER_IP,
    port: process.env.COD4_SERVER_PORT,
    hostname: res.sv_hostname || 'OFFLINE',
    gametype: res.g_gametype || 'n/a',
    maxclients: res.sv_maxclients || 0,
    upTime: res.uptime || 'n/a',
    mapStartTime: res.g_mapStartTime || new Date().toUTCString(),
    privateClients: res.sv_privateClients || 0,
    modName: res._Mod || res.fs_game || 'n/a',
    version: res.version || 'n/a',
    map: res.mapname || 'n/a',
    onlinePlayers: res.onlinePlayers || []
  };
  // status.online = !!res;
  // status.hostname = res.sv_hostname;
  // status.gametype = res.g_gametype;
  // status.maxclients = res.sv_maxclients;
  // status.upTime = res.uptime;
  // status.mapStartTime = res.g_mapStartTime;
  // status.privateClients = res.sv_privateClients;
  // status.modName = res._Mod || res.fs_game;
  // status.version = res.version;
  // status.map = res.mapname;
  // status.onlinePlayers = res.onlinePlayers;

  if (!getFullInfo) {
    return status;
  } else {
    res = await executeRconCommand('status');
    const lines = res.split('\n');
    let players = [];
    lines.forEach((line, i) => {
      const patternPl = /^\s*(\d+)\s+(-?\d+)\s+(\d+)\s+(\d+)\s+([a-fA-F0-9]{16,32}|\d+) (.+?)\s+(\d+) (\d+\.\d+\.\d+\.\d+):(\-?\d+)\s+(\-?\d+)\s+(\d+)$/;
      let lineParsed = line.match(patternPl);
      if (lineParsed) {
        const playerParsed = {
          num: parseInt(lineParsed[1]),
          score: parseInt(lineParsed[2]),
          ping: parseInt(lineParsed[3]),
          playerid: lineParsed[4],
          steamid: lineParsed[5],
          name: lineParsed[6],
          lastmsg: lineParsed[7],
          address: lineParsed[8],
          port: parseInt(lineParsed[9]),
          qport: parseInt(lineParsed[10]),
          rate: parseInt(lineParsed[11])
        };
        if (playerParsed.name.endsWith('^7')) {
          playerParsed.name = playerParsed.name.slice(
            0,
            playerParsed.name.length - 2
          );
        }
        players.push(playerParsed);
      }
    });
    players = players.sort((a, b) => parseInt(b.score) - parseInt(a.score));
    status.onlinePlayers = [...players];
    return status;
  }
};

const getInfo = async (maxTimeOut = 500) => {
  const getInfo = await executeCommand('getinfo', maxTimeOut);
  const infos = getInfo.split('\\');
  const infoObj = {};
  for (let i = 2; i < infos.length; i = i + 2) {
    infoObj[infos[i - 1]] = infos[i];
  }
  return infoObj;
};

const getStatus = async (maxTimeOut = 500) => {
  const getStatus = await executeCommand('getstatus', maxTimeOut);
  const lines = getStatus.split('\n');
  const status = lines[0].split('\\');
  const statusObj = {};
  statusObj.onlinePlayers = [];
  for (let i = 2; i < status.length; i = i + 2) {
    statusObj[status[i - 1]] = status[i];
  }
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const patternPlayerInfo = /^(-?\d+)\s+(-?\d+)\s+"(.*)"$/;
    lineParsed = line.match(patternPlayerInfo);
    if (lineParsed) {
      statusObj.onlinePlayers.push({
        score: lineParsed[1],
        ping: lineParsed[2],
        name: lineParsed[3]
      });
    }
  }
  statusObj.onlinePlayers.sort((a, b) => parseInt(b.score) - parseInt(a.score));
  return statusObj;
};

exports.executeRconCommand = executeRconCommand;
exports.executeCommand = executeCommand;
exports.serverStatus = serverStatus;
