const { prisma } = require('../generated/prisma-client');

const { serverStatus } = require('../../cod/rcon');
const {
  searchPlayersQuery,
  playerByIdQuery,
  adminsQuery,
  vipsQuery
} = require('../../sqlitedb/queriesDb');
const { admins, vips } = require('../../cod/admins-vips');
const { dbAll, dbGet } = require('../../helpers/dbUtils');
const {
  checkAuthentication,
  checkAuthorization
} = require('../../helpers/auth');
const { getCookieFromReq } = require('../../helpers/utils');

const setAdminOrVipName = player => {
  let output = { ...player, vipName: '', adminName: '' };
  admins.map(admin => {
    const adminIndex = admin.guid.findIndex(el => el === player.playerGUID);
    if (adminIndex >= 0) {
      output = {
        ...player,
        vipName: '',
        adminName: admin.name
      };
    }
  });
  vips.map(vip => {
    const vipIndex = vip.guid.findIndex(el => el === player.playerGUID);
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

const Query = {
  async me(parent, args, ctx, info) {
    if (!ctx.req || !ctx.req.userId) {
      return null;
    }
    const user = await prisma.user({ id: ctx.req.userId });
    const token = getCookieFromReq(ctx.req, 'token');
    return { user, token };
  },
  async player(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT', 'ADMIN', 'MODERATOR', 'VIP']);
    const { playerId } = args;
    const row = await dbGet(ctx.sqlitedb, playerByIdQuery(playerId));
    if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
    return row;
  },
  async codServerStatus(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT', 'ADMIN', 'MODERATOR', 'VIP']);
    const status = await serverStatus();
    status.onlinePlayers = status.onlinePlayers.map(async player => {
      let dbPlayer =
        (await dbGet(ctx.sqlitedb, playerByIdQuery(player.playerid))) || {};
      if (dbPlayer.isVip || dbPlayer.isAdmin)
        dbPlayer = setAdminOrVipName(dbPlayer);
      return {
        ...dbPlayer,
        pid: player.num,
        score: player.score,
        ping: player.ping,
        playerGUID: player.playerid,
        steamid: player.steamid,
        name: player.name,
        playerIP: player.address,
        port: player.port
      };
    });
    return status;
  },
  async codServerMiniStatus(parent, args, ctx, info) {
    checkAuthentication(ctx);
    // TODO
  },
  async searchPlayers(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT', 'ADMIN', 'MODERATOR', 'VIP']);
    const { search, limit = 10, offset = 0 } = args;
    if (!search) throw new Error('search is a required field');
    const rows = await dbAll(
      ctx.sqlitedb,
      searchPlayersQuery(search, limit, offset)
    );
    return rows.map(row => {
      if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
      return row;
    });
  },
  async admins(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT', 'ADMIN', 'MODERATOR', 'VIP']);
    const rows = await dbAll(ctx.sqlitedb, adminsQuery());
    return rows.map(row => {
      if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
      return row;
    });
  },
  async vips(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT', 'ADMIN', 'MODERATOR', 'VIP']);
    const rows = await dbAll(ctx.sqlitedb, vipsQuery());
    return rows.map(row => {
      if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
      return row;
    });
  }
};

module.exports = Query;
