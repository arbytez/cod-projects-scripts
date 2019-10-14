const signale = require('../logger');
const { prisma } = require('../server/generated/prisma-client');

let admins = [];
let vips = [];

const adminSub = async () => {
  const adminAsyncIterator = await prisma.$subscribe.adminPlayer();
  for await (const newOrUpdatedAdmin of adminAsyncIterator) {
    updateAdminPlayers();
  }
};

const playerSub = async () => {
  const vipAsyncIterator = await prisma.$subscribe.vipPlayer();
  for await (const newOrUpdatedVip of vipAsyncIterator) {
    updateVipPlayers();
  }
};

const updateAdminPlayers = () => {
  prisma
    .adminPlayers()
    .then(res => {
      admins = res;
      signale.info(`admin players updated (found: ${admins.length}).`);
    })
    .catch(err => {
      signale.error(err);
    });
};

const updateVipPlayers = () => {
  prisma
    .vipPlayers()
    .then(res => {
      vips = res;
      signale.info(`vip players updated (found: ${vips.length}).`);
    })
    .catch(err => {
      signale.error(err);
    });
};

const getPlayersGuid = playersArray => {
  let output = '';
  let guids = [];
  playersArray.map(player => {
    guids = guids.concat(player.guids);
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

const setAdminOrVipName = player => {
  let output = { ...player, vipName: '', adminName: '' };
  admins.map(admin => {
    const adminIndex = admin.guids.findIndex(el => el === player.playerGUID);
    if (adminIndex >= 0) {
      output = {
        ...player,
        vipName: '',
        adminName: admin.name
      };
    }
  });
  vips.map(vip => {
    const vipIndex = vip.guids.findIndex(el => el === player.playerGUID);
    if (vipIndex >= 0) {
      output = {
        ...player,
        vipName: vip.name,
        adminName: ''
      };
    }
  });
  return output;
};

// get admin / vip players
updateAdminPlayers();
updateVipPlayers();
adminSub();
playerSub();

exports.admins = admins;
exports.vips = vips;
exports.adminsGuid = adminsGuid;
exports.vipsGuid = vipsGuid;
exports.updateAdminPlayers = updateAdminPlayers;
exports.updateVipPlayers = updateVipPlayers;
exports.setAdminOrVipName = setAdminOrVipName;
