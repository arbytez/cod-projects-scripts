const jwt = require('jsonwebtoken');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { importSchema } = require('graphql-import');

const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const Subscription = require('./resolvers/Subscription');
const pubsub = require('./pubsub');
const getRethinkDbConn = require('./db/rethinkDb');

const schema = makeExecutableSchema({
  typeDefs: importSchema('src/schema.graphql'),
  resolvers: {
    Mutation,
    Query,
    Subscription
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

function createServer() {
  return new ApolloServer({
    schema,
    context: async ({ req, connection }) => {
      const rethinkDbConn = await getRethinkDbConn();
      if (connection) {
        const connCtx = connection.context;
        return { ...req, pubsub, rethinkDbConn, connCtx };
      }
      return { ...req, pubsub, rethinkDbConn };
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        const { authorization } = connectionParams.headers || {};
        if (authorization) {
          try {
            const user = jwt.verify(authorization, process.env.JWT_SECRET);
            if (user) return { user };
          } catch (error) {}
        }
      }
    }
  });
}

module.exports = createServer;
