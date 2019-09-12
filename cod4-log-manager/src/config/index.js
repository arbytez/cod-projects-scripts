const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname);

let users = null;
let basics = null;

const readConfigs = () => {
  const basicsData = fs.readFileSync(path.join(configPath, 'basics.json'));
  const usersData = fs.readFileSync(path.join(configPath, 'users.json'));

  users = JSON.parse(usersData);
  basics = JSON.parse(basicsData);
};

exports.readConfigs = readConfigs;
exports.usersConfig = () => users;
exports.basicsConfig = () => basics;
