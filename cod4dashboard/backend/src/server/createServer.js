const {
  ApolloServer,
  makeExecutableSchema,
  AuthenticationError
} = require('apollo-server-express');
const { importSchema } = require('graphql-import');

const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const Subscription = require('./resolvers/Subscription');
const sqlitedb = require('../sqlitedb/initDb');
const pubsub = require('./pubsub');
const db = require('./db');
const { validateToken } = require('../helpers/auth');
const { getTokenFromReq } = require('../helpers/utils');

const schema = makeExecutableSchema({
  typeDefs: importSchema('src/server/schema.graphql'),
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
    context: async ({ req, connection, payload }) => {
      if (connection) {
        const connCtx = connection.context;
        try {
          if (payload && payload.authorization) {
            const decodedToken = await validateToken(payload.authorization);
            if (decodedToken) {
              connCtx.userId = decodedToken.userId;
            }
          }
        } catch (error) {}
        return { req, pubsub, sqlitedb, db, connCtx };
      }
      return { req, pubsub, sqlitedb, db };
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        try {
          if (connectionParams && connectionParams.authorization) {
            const decodedToken = await validateToken(
              connectionParams.authorization
            );
            if (decodedToken) {
              const userId = decodedToken.userId;
              return { userId };
            }
          }
        } catch (error) {}
        try {
          if (webSocket && webSocket.upgradeReq) {
            const token = getTokenFromReq(webSocket.upgradeReq);
            if (token) {
              const decodedToken = await validateToken(token);
              if (decodedToken) {
                const userId = decodedToken.userId;
                return { userId };
              }
            }
          }
        } catch (error) {}
      }
    },
    engine: {
      rewriteError(err) {
        // Return `null` to avoid reporting `AuthenticationError`s
        if (err instanceof AuthenticationError) {
          return null;
        }
        // All other errors will be reported.
        return err;
      }
    }
  });
}

module.exports = createServer;
