const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { validateToken } = require('../helpers/auth');
const { getTokenFromReq } = require('../helpers/utils');
const signale = require('../logger');

// server port
const port = process.env.PORT || 4000;

// graphQl server creation
const createServer = require('./createServer');
const db = require('./db');

const apollo = createServer();

// express server
const app = express();

// middlewares
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// decode the JWT so we can get the user on each request
app.use(async (req, res, next) => {
  const token = getTokenFromReq(req);
  if (token) {
    const decodedToken = await validateToken(token);
    if (decodedToken) {
      req.userId = decodedToken.userId;
    }
  }
  next();
});

// create a middleware that populates the user on each request
app.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, email, username, roles }'
  );
  req.user = user;
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
  app
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
    `server listening at http${process.env.SSL === 'true' ? 's' : ''}://${
      process.env.HOSTNAME
    }:${port}${apollo.graphqlPath}`
  )
);

module.exports = server;
