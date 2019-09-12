const dgram = require('dgram');
const iconv = require('iconv-lite');

function createCommand(command) {
  const cmd = `rcon ${process.env.COD4_RCON} ${command}`;
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

const sendUdpMessage = (message, host, port, instantPrint) => {
  return new Promise((resolve, reject) => {
    try {
      let out = '';
      let socket = dgram.createSocket('udp4');
      socket.send(createCommand(message), port, host);
      socket.on('message', (incomingMessage, rinfo) => {
        const res = Buffer.from(incomingMessage)
          .toString()
          .replace('����print', '')
          .replace('\n', '');
        out += res;
        if (instantPrint) console.log(res);
      });
      setTimeout(() => {
        socket.close();
        socket = null;
        resolve(out);
      }, 1000);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      reject(error.message);
    }
  });
};

const executeCommand = async (command, instantPrint = false) => {
  const res = await sendUdpMessage(
    command,
    process.env.COD4_SERVER_IP,
    process.env.COD4_SERVER_PORT,
    instantPrint
  );
  return res;
};

const serverStatus = async () => {
  const res = await executeCommand('status');
  const lines = res.split('\n');
  let status = {
    online: false,
    hostname: '',
    version: '',
    os: '',
    type: '',
    map: '',
    onlinePlayers: []
  };
  let players = [];
  status.online = !!res;
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
    const patternHn = /^\s*hostname\s*\:\s*(.*)$/;
    lineParsed = line.match(patternHn);
    if (lineParsed) {
      status.hostname = lineParsed[1];
    }
    const patternVer = /^\s*version\s*\:\s*(.*)$/;
    lineParsed = line.match(patternVer);
    if (lineParsed) {
      status.version = lineParsed[1];
    }
    const patternOs = /^\s*os\s*\:\s*(.*)$/;
    lineParsed = line.match(patternOs);
    if (lineParsed) {
      status.os = lineParsed[1];
    }
    const patterntype = /^\s*type\s*\:\s*(.*)$/;
    lineParsed = line.match(patterntype);
    if (lineParsed) {
      status.type = lineParsed[1];
    }
    const patternMap = /^\s*map\s*\:\s*(.*)$/;
    lineParsed = line.match(patternMap);
    if (lineParsed) {
      status.map = lineParsed[1];
    }
  });
  players = players.sort((a, b) => parseInt(b.score) - parseInt(a.score));
  status.onlinePlayers = [...players];
  serverStatusCached = { ...status };
  return serverStatusCached;
};

exports.executeCommand = executeCommand;
exports.serverStatus = serverStatus;
