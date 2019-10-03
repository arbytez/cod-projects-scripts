const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const { Signale } = require('signale');

const logsDir = path.join(__dirname, 'logs');
const logFileName = `${format(new Date(), 'yyyy-MM-dd HH.mm.ss')}.log`;

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

let signale = new Signale();
if (process.env.WRITE_LOG_TO_FILE === 'true') {
  const stream = fs.createWriteStream(path.join(logsDir, logFileName), {
    flags: 'w'
  });

  const options = {
    stream: [process.stdout, stream]
  };
  signale = new Signale(options);
}

signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: true
});

module.exports = signale;
