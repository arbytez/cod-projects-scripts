const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');

const prod = process.env.NODE_ENV === 'production';

let envPath = '';
if (prod) {
  envPath = path.join(__dirname, '..', '.env.production');
} else {
  envPath = path.join(__dirname, '..', '.env.development');
}
require('dotenv').config({ path: envPath });

const signale = require('./logger');
signale.info(`script started in '${process.env.NODE_ENV}' mode!`);

const port = process.env.PORT || 4000;

// init local config dir
require('./config').readConfigs();

// init db
require('./db/initDb')();

// graphQl server creation
const createServer = require('./createServer');
const apollo = createServer();

// tail cod4 server log
const tail = require('./log_monitor');

// express server
const app = express();

app.use(cookieParser());

// decode the JWT so we can get the user on each request
app.use(async (req, res, next) => {
  let { token } = req.cookies;
  if (!token) token = req.headers['authorization'];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (decodedToken) req.user = decodedToken;
    } catch (error) {}
  }
  next();
});

// If there’s an error, send it as JSON so it’s useful in the GraphQL output.
app.use((err, _, res, next) => {
  if (err) {
    signale.error(err);
    res.json(err);
  }
  next();
});

apollo.applyMiddleware({
  app,
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Create the HTTPS or HTTP server, per configuration
let server;
if (process.env.SSL === 'true') {
  server = https.createServer(
    {
      key: fs.readFileSync(process.env.SERVER_KEY_PATH), // `./ssl/server.key`
      cert: fs.readFileSync(process.env.SERVER_CERT_PATH) // `./ssl/server.crt`
    },
    app
  );
} else {
  server = http.createServer(app);
}

// Add subscription support
apollo.installSubscriptionHandlers(server);

server.listen({ port }, () =>
  signale.await(
    `Server ready at http${process.env.SSL === 'true' ? 's' : ''}://${
      process.env.HOSTNAME
    }:${port}${apollo.graphqlPath}`
  )
);

// background worker
require('./backgroundWorker').startBackgroundWorker();
