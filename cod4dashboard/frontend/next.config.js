const path = require('path');
const Dotenv = require('dotenv-webpack');
const withCSS = require('@zeit/next-css');

let envPath = '';
switch (process.env.NODE_ENV) {
  case 'production':
    envPath = path.join(__dirname, 'src', 'config', 'production.env');
    break;
  case 'development':
    envPath = path.join(__dirname, 'src', 'config', 'development.env');
    break;
  case 'test':
    envPath = path.join(__dirname, 'src', 'config', 'test.env');
    break;
  default:
    throw new Error(`Environment '${process.env.NODE_ENV}' not managed!`);
}

module.exports = withCSS({
  webpack: config => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: envPath,
        systemvars: true
      })
    ];

    return config;
  }
});
