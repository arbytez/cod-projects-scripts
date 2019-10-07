const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');
const { forwardTo } = require('prisma-binding');

const { prisma } = require('../generated/prisma-client');
const {
  checkAuthentication,
  checkAuthorization,
  generateToken
} = require('../../helpers/auth');
const { getCookieFromReq } = require('../../helpers/utils');
const {
  validateUser,
  validateSignInUser,
  validate
} = require('../../helpers/validations');

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
    const token = await generateToken(ctx, user);
    return { user, token };
  },
  async signOut(parent, args, ctx, info) {
    // delete token from server
    const token = getCookieFromReq(ctx.req, 'token');
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
    const token = await generateToken(ctx, user);
    return { user, token };
  }
};

module.exports = Mutation;
