const path = require('path');

// read env variables
let envPath = '';
switch (process.env.NODE_ENV) {
  case 'production':
    envPath = path.join(__dirname, '..', '..', '.env.production');
    break;
  case 'development':
    envPath = path.join(__dirname, '..', '..', '.env.development');
    break;
  case 'test':
    envPath = path.join(__dirname, '..', '..', '.env.test');
    break;
  default:
    throw new Error(`NODE_ENV '${process.env.NODE_ENV}' not managed!`);
    break;
}

require('dotenv').config({ path: envPath });
