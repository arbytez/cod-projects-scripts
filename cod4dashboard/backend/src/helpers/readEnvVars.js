const path = require('path');

const prod = process.env.NODE_ENV === 'production';

// read env variables
let envPath = '';
if (prod) {
  envPath = path.join(__dirname, '..', '..', '.env.production');
} else {
  envPath = path.join(__dirname, '..', '..', '.env.development');
}
require('dotenv').config({ path: envPath });
