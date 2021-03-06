const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { addDays } = require('date-fns');

const { prisma } = require('../server/generated/prisma-client');

exports.hasPermission = (user, permissionsNeeded) => {
  try {
    if (!user || !user.roles) return false;
    const matchedPermissions = user.roles.filter(permissionTheyHave =>
      permissionsNeeded.includes(permissionTheyHave)
    );
    return Boolean(matchedPermissions.length);
  } catch (error) {
    return false;
  }
};

exports.checkAuthentication = ctx => {
  if (!ctx.req || !ctx.req.userId || !ctx.req.user) {
    throw new AuthenticationError('Not authenticated!');
  }
};

exports.checkAuthorization = (ctx, roles) => {
  this.checkAuthentication(ctx);
  if (!this.hasPermission(ctx.req.user, roles)) {
    throw new AuthenticationError('Unauthorized!');
  }
};

exports.checkAuthenticationSub = ctx => {
  if (!ctx.connCtx || !ctx.connCtx.userId) {
    throw new AuthenticationError('Not authenticated!');
  }
};

exports.checkAuthorizationSub = async (ctx, roles) => {
  this.checkAuthenticationSub(ctx);
  const user = await prisma.user({ id: ctx.connCtx.userId });
  if (!this.hasPermission(user, roles)) {
    throw new AuthenticationError('Unauthorized!');
  }
};

exports.validateToken = async token => {
  let tokensSearched = [];
  let decodedToken = {};
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken) {
      // ensure that the token was generated by this server
      tokensSearched = await prisma.tokens({
        where: { user: { id: decodedToken.userId }, content: token }
      });
    }
  } catch (error) {}
  if (tokensSearched.length !== 1) {
    // Token not processed by this server
    return undefined;
  }
  return decodedToken;
};

exports.generateToken = async user => {
  // generate the JWT Token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  // delete all the expired user tokens
  await prisma.deleteManyTokens({
    user: { id: user.id },
    expiration_lt: new Date()
  });

  // save the generated token
  await prisma.createToken({
    content: token,
    expiration: addDays(new Date(), 7),
    user: { connect: { id: user.id } }
  });

  return token;
};
