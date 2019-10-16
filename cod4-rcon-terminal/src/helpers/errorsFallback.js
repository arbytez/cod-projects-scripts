// catch all the unmanaged errors and stop script
process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
