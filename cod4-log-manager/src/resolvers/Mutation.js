const { randomBytes } = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { hasPermission } = require('../utils');

const Mutation = {
  async requestUrl(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Not Authenticated!');
    const { tgid } = ctx.user;
    const randomBytesPromiseified = promisify(randomBytes);
    const urlToken = (await randomBytesPromiseified(20)).toString('hex');
    const url = `${process.env.FRONTEND_URL}?user=${tgid}&token=${urlToken}`;
    const urlTokenExpiry = Date.now() + 3600000; // 1 hour from now
    // const user = await ctx.prismaDb.mutation.updateUser({
    //   data: { urlToken, urlTokenExpiry },
    //   where: { tgid }
    // });
    const urlExpiry = user.urlTokenExpiry;
    return { url, urlExpiry };
  },
  async login(parent, args, ctx, info) {
    const { userId, urlToken } = args;
    // const user = await ctx.prismaDb.query.user({
    //   where: { tgid: userId }
    // });
    if (
      !user ||
      user.urlToken !== urlToken ||
      user.urlTokenExpiry <= Date.now()
    ) {
      throw new Error('User not found or invalid token!');
    }
    const expirationSeconds = Math.round(
      (user.urlTokenExpiry - Date.now()) / 1000
    );
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: expirationSeconds
    });
    ctx.res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * expirationSeconds
    });
    return null;
    // return ctx.prismaDb.query.user(
    //   {
    //     where: { tgid: userId }
    //   },
    //   info
    // );
  },
  async logout(parent, args, ctx, info) {
    ctx.res.clearCookie('token');
    return true;
  }
};

module.exports = Mutation;
