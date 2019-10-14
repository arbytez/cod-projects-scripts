const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');
const { forwardTo } = require('prisma-binding');

const { prisma } = require('../generated/prisma-client');
const { generateToken } = require('../../helpers/auth');
const { getTokenFromReq } = require('../../helpers/utils');
const {
  validateUser,
  validateSignInUser,
  validate
} = require('../../helpers/validations');
const {
  checkAuthentication,
  checkAuthorization
} = require('../../helpers/auth');

const Mutation = {
  async signIn(parent, args, ctx, info) {
    const { email, password } = args;
    validate({ email, password })(validateSignInUser);
    // check if user exists
    const user = await prisma.user({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials!');
    }
    // Check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Invalid credentials!');
    }
    const token = await generateToken(user);
    return { user, token };
  },
  async signOut(parent, args, ctx, info) {
    // delete token from server
    const token = getTokenFromReq(ctx.req);
    if (token) {
      await prisma.deleteToken({ content: token });
    }
    return true;
  },
  async signUp(parent, args, ctx, info) {
    let { email, username, password } = args;
    validate({ email, username, password })(validateUser);
    password = await bcrypt.hash(password, 10);
    const user = await prisma.createUser({
      ...args,
      password,
      roles: { set: ['PLAYER'] }
    });
    const token = await generateToken(user);
    return { user, token };
  },
  async createAdminPlayer(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT']);
    return forwardTo('db')(parent, args, ctx, info);
  },
  async createVipPlayer(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT']);
    return forwardTo('db')(parent, args, ctx, info);
  },
  async updateAdminPlayer(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT']);
    return forwardTo('db')(parent, args, ctx, info);
  },
  async updateVipPlayer(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT']);
    return forwardTo('db')(parent, args, ctx, info);
  },
  async deleteAdminPlayer(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT']);
    return forwardTo('db')(parent, args, ctx, info);
  },
  async deleteVipPlayer(parent, args, ctx, info) {
    checkAuthorization(ctx, ['ROOT']);
    return forwardTo('db')(parent, args, ctx, info);
  }
};

module.exports = Mutation;
