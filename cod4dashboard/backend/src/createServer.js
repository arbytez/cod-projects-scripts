const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
// const { makeExecutableSchema } = require('apollo-server');
const { importSchema } = require('graphql-import');

const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const Subscription = require('./resolvers/Subscription');
const sqlitedb = require('./sqlitedb');

const pubsub = new PubSub();

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
      if (connection) {
        const connCtx = connection.context;
        return { ...req, sqlitedb, pubsub, connCtx };
      }
      return { ...req, sqlitedb, pubsub };
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        if (connectionParams.authToken) {
          try {
            const user = jwt.verify(
              connectionParams.authToken,
              process.env.JWT_SECRET
            );
            if (user) return { user };
          } catch (error) {}
        }
      }
    }
  });
}

module.exports = createServer;
