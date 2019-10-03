const admins = [
  {
    guid: ['admin1-id1', 'admin1-id2'],
    name: 'admin1-name'
  },
  {
    guid: ['admin2-id1', 'admin2-id2'],
    name: 'admin2-name'
  }
];

const vips = [
  {
    guid: ['vip1-id1'],
    name: 'vip1-name'
  },
  {
    guid: ['vip2-id1', 'vip2-id2'],
    name: 'vip2-name'
  }
];

const getPlayersGuid = playersArray => {
  let output = '';
  let guids = [];
  playersArray.map(player => {
    guids = guids.concat(player.guid);
  });
  guids.map(guid => {
    output += `"${guid}",`;
  });
  output = output.slice(0, output.length - 1);
  return output;
};

const adminsGuid = () => {
  return getPlayersGuid(admins);
};

const vipsGuid = () => {
  return getPlayersGuid(vips);
};

exports.admins = admins;
exports.vips = vips;
exports.adminsGuid = adminsGuid;
exports.vipsGuid = vipsGuid;
