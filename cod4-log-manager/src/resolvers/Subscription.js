const { hasPermission } = require('../utils');

const Subscription = {
  logEvent: {
    subscribe: async (parent, args, ctx) => {
      // if (!ctx.connCtx.user) throw new Error('Not Authenticated!');
      // if (!hasPermission(ctx.connCtx.user, ['ADMIN']))
      //   throw new Error('Unauthorized!');
      return ctx.pubsub.asyncIterator('log_event');
    }
  },
  status: {
    subscribe: async (parent, args, ctx) => {
      // if (!ctx.connCtx.user) throw new Error('Not Authenticated!');
      // if (!hasPermission(ctx.connCtx.user, ['ADMIN']))
      //   throw new Error('Unauthorized!');
      return ctx.pubsub.asyncIterator('status');
    }
  }
};

module.exports = Subscription;
