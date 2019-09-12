const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { executeCommand } = require('../rcon');

const Mutation = {
  async login(parent, args, ctx, info) {
    // Only for generate the BCRYPT_PASSWORD
    //console.log(await bcrypt.hash('test', 10));
    const { password } = args;
    if (!password) throw new Error('password is a required field');
    // Check if password is correct
    const valid = await bcrypt.compare(password, process.env.BCRYPT_PASSWORD);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    // generate the JWT Token
    const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    // Set the cookie with the token
    ctx.res.cookie('token', token, {
      // httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
    });
    return true;
  },
  async logout(parent, args, ctx, info) {
    ctx.res.clearCookie('token');
    return true;
  },
  async sendRconCommand(parent, args, ctx, info) {
    if (!ctx.user) throw new Error('Unauthorized!');
    const { command } = args;
    if (!command) throw new Error('command is a required field!');
    // if (
    //   command.toLowerCase().startsWith('killserver') ||
    //   command.toLowerCase().startsWith('quit')
    // )
    //   throw new Error('Can not execute this command!');
    const rconResponse = await executeCommand(command);
    ctx.pubsub.publish('rconresponse', {
      commandResponses: rconResponse
    });
    return rconResponse;
  }
};

module.exports = Mutation;
