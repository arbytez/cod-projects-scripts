const jwt = require('jsonwebtoken');

const { serverStatus } = require('../rcon');
const {
  searchPlayersQuery,
  playerByIdQuery,
  adminsQuery,
  vipsQuery
} = require('../DbQuery');
const { admins, vips } = require('../admins-vips');

const dbAll = (db, query) =>
  new Promise((resolve, reject) => {
    try {
      db.all(query, (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    } catch (error) {
      return reject(error);
    }
  });

const dbGet = (db, query) =>
  new Promise((resolve, reject) => {
    try {
      db.get(query, (err, row) => {
        if (err) return reject(err);
        return resolve(row);
      });
    } catch (error) {
      return reject(error);
    }
  });

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
  async player(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Unauthorized!');
    const { id } = args;
    const row = await dbGet(ctx.sqlitedb, playerByIdQuery(id));
    if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
    return row;
  },
  async serverStatus(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Unauthorized!');
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
  async searchPlayers(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Unauthorized!');
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
    if (!ctx.user) throw new Error('Unauthorized!');
    const rows = await dbAll(ctx.sqlitedb, adminsQuery());
    return rows.map(row => {
      if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
      return row;
    });
  },
  async vips(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Unauthorized!');
    const rows = await dbAll(ctx.sqlitedb, vipsQuery());
    return rows.map(row => {
      if (row.isVip || row.isAdmin) row = setAdminOrVipName(row);
      return row;
    });
  },
  async isLogged(parent, args, ctx, info) {
    const { token } = args;
    if (!token) return false;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (decodedToken) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
};

module.exports = Query;
