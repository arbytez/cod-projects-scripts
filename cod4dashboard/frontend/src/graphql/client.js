import { GraphQLClient, request } from 'graphql-request';
import Cookies from 'js-cookie';

import {
  SEARCH_PLAYERS_QUERY,
  SERVER_STATUS_QUERY,
  ADMINS_QUERY,
  VIPS_QUERY,
  IS_LOGGED_QUERY
} from './queries';
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SEND_RCONCOMMAND_MUTATION
} from './mutations';
import { COMMAND_RESPONSES_SUBSCRIPTION } from './subscriptions';

const endpoint = process.env.ENDPOINT_URL;

let graphQLClient;

const createNewGraphQLClient = (token = '') => {
  return new GraphQLClient(endpoint, {
    credentials: 'include',
    headers: {
      authorization: !token ? Cookies.getJSON('token') : token
    },
    mode: 'cors'
  });
};

const GetGraphQLClient = (forcedToken = '') => {
  if (forcedToken) {
    graphQLClient = createNewGraphQLClient(forcedToken);
  }
  if (!graphQLClient) {
    graphQLClient = createNewGraphQLClient();
  }
  return graphQLClient;
};

const execGraphQL = (query, variables) => {
  return GetGraphQLClient().request(query, variables);
};

const searchPlayers = searchParam => {
  return GetGraphQLClient().request(SEARCH_PLAYERS_QUERY, {
    search: searchParam
  });
};

const serverStatus = () => {
  return GetGraphQLClient().request(SERVER_STATUS_QUERY);
};

const admins = () => {
  return GetGraphQLClient().request(ADMINS_QUERY);
};

const vips = () => {
  return GetGraphQLClient().request(VIPS_QUERY);
};

const adminsAndVips = async () => {
  const adminsRes = await GetGraphQLClient().request(ADMINS_QUERY);
  const vipsRes = await GetGraphQLClient().request(VIPS_QUERY);
  return {
    admins: [...adminsRes.admins],
    vips: [...vipsRes.vips]
  };
};

const login = password => {
  return GetGraphQLClient().request(LOGIN_MUTATION, { password });
};

const logout = () => {
  return GetGraphQLClient().request(LOGOUT_MUTATION);
};

const isLogged = token => {
  return GetGraphQLClient().request(IS_LOGGED_QUERY, { token });
};

const sendRconCommand = command => {
  return GetGraphQLClient().request(SEND_RCONCOMMAND_MUTATION, { command });
};

const commandResponses = () => {
  return GetGraphQLClient().request(COMMAND_RESPONSES_SUBSCRIPTION);
};

export {
  execGraphQL,
  searchPlayers,
  serverStatus,
  admins,
  vips,
  adminsAndVips,
  login,
  logout,
  isLogged,
  GetGraphQLClient,
  sendRconCommand,
  commandResponses,
  endpoint
};
