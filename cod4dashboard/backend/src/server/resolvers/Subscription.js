const { forwardTo } = require('prisma-binding');

const { checkAuthorizationSub } = require('../../helpers/auth');

const Subscription = {
  user: {
    subscribe: async (parent, args, ctx, info) => {
      await checkAuthorizationSub(ctx, ['ROOT', 'ROLEUPDATE']);
      return forwardTo('db')(parent, args, ctx, info);
    }
  }
};

module.exports = Subscription;
