const { executeCommand } = require('./helpers/rcon');

const standard_input = process.stdin;
standard_input.setEncoding('utf-8');
process.stdout.setEncoding('utf-8');

let loading = false;
console.info(
  `Send rcon command to execute (q for exit):\ncod4server: ${process.env.COD4_SERVER_IP}:${process.env.COD4_SERVER_PORT}`
);

standard_input.on('data', async data => {
  data = data
    .replace('\r', '')
    .replace('\n', '')
    .toString();
  if (data === 'q') {
    console.info('script stopped.');
    process.exit(0);
  } else {
    if (!loading) {
      loading = true;
      await executeCommand(data, process.env.MAX_TIMEOUT, true);
      loading = false;
    }
  }
});
