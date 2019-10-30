import React from 'react';
import { GraphQLClient } from 'graphql-request';
import cookie from 'js-cookie';

import { getSdk } from '../generated/js/sdk';

const createNewGraphQlClient = (options = {}) =>
  getSdk(new GraphQLClient(`${process.env.ENDPOINT_HTTP}`, options));

const useClient = () => {
  const token = cookie.get('token');
  const [idToken, setIdToken] = React.useState('');

  React.useEffect(() => {
    if (token) setIdToken(token);
    else setIdToken('');
  }, [token]);

  return getSdk(
    new GraphQLClient(`${process.env.ENDPOINT_HTTP}`, {
      headers: { authorization: idToken }
    })
  );
};

export { createNewGraphQlClient };
export default useClient;
