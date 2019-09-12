const Subscription = {
  commandResponses: {
    subscribe: async (parent, args, ctx) => {
      if (!ctx.connCtx.user) throw new Error('Unauthorized!');
      return ctx.pubsub.asyncIterator('rconresponse');
    }
  }
};

module.exports = Subscription;
