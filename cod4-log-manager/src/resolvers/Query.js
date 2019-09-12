const { hasPermission } = require('../utils');

const Query = {
  async me(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Not Authenticated!');
    const { name } = ctx.user;
    // return ctx.prismaDb.query.user(
    //   {
    //     where: { name }
    //   },
    //   info
    // );
  }
};

module.exports = Query;
