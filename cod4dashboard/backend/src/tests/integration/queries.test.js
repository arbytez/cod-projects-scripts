const fs = require('fs');
const path = require('path');
const EasyGraphQLTester = require('easygraphql-tester');

const Query = require('../../server/resolvers/Query');
const Mutation = require('../../server/resolvers/Mutation');
const Subscription = require('../../server/resolvers/Subscription');

const customSchema = fs.readFileSync(
  path.join(__dirname, '..', '..', 'server', 'schema.graphql'),
  'utf8'
);
const prismaSchema = fs.readFileSync(
  path.join(__dirname, '..', '..', 'server', 'generated', 'prisma.graphql'),
  'utf8'
);

const resolvers = {
  Query,
  Mutation,
  Subscription
};

let tester;

describe('Graphql queries', () => {
  beforeAll(() => {
    tester = new EasyGraphQLTester([prismaSchema, customSchema], resolvers);
  });

  describe('/me', () => {
    let ctx = {};

    it('should return null if user is not logged', async () => {
      ctx.req = null;
      const query = `
      query {
        me {
          token
        }
      }`;
      const result = await tester.graphql(query, undefined, ctx, undefined);
      console.log(result);
      expect(result.errors).toBeUndefined();
      expect(result.data.me).toBeNull();
    });
  });
});
