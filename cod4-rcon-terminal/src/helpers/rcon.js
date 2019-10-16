const dgram = require('dgram');
const iconv = require('iconv-lite');

function createCommand(command) {
  let cmd = '';
  if (command === 'getstatus' || command === 'getinfo') {
    cmd = command;
  } else {
    cmd = `rcon ${process.env.COD4_RCON} ${command}`;
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
  maxTimeOut = 1000
) => {
  return new Promise((resolve, reject) => {
    try {
      let out = '';
      let socket = dgram.createSocket('udp4');
      socket.send(createCommand(message), port, host);
      socket.on('message', (incomingMessage, rinfo) => {
        const res = Buffer.from(incomingMessage)
          .toString()
          .replace('����print', '')
          .replace('����infoResponse', '')
          .replace('����statusResponse', '')
          .replace('\n', '');
        out += res;
        if (instantPrint) process.stdout.write(res);
      });
      setTimeout(() => {
        socket.close();
        socket = null;
        resolve(out);
      }, maxTimeOut);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      reject(error.message);
    }
  });
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
    maxTimeOut
  );
  return res;
};

exports.executeCommand = executeCommand;
