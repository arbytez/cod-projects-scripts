import React from 'react';

import { redirectUser } from '../helpers/auth';

function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ req, res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const ctx = {};
  ctx.req = req;
  ctx.res = res;
  redirectUser(ctx, '/login');
  return { statusCode };
};

export default Error;
