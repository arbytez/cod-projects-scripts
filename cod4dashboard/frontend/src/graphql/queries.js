const onPlayer = `
  playerID
  playerGUID
  aliases
  firstActivityDate
  lastActivityDate
  firstActivityIP
  playerIP
  port
  connections
  onlineTime
  online
  punishmentScore
  kills
  deaths
  headShots
  teamKills
  teamDeaths
  selfKills
  steamid
  pid
  score
  ping
  name
  isVip
  isAdmin
  vipName
  adminName
`;

const SEARCH_PLAYERS_QUERY = `
  query SEARCH_PLAYERS_QUERY(
    $search: String!
    $limit: Int = 100
    $offset: Int = 0
  ) {
    searchPlayers(search: $search, limit: $limit, offset: $offset) {
      ${onPlayer}
    }
  }
`;

const SERVER_STATUS_QUERY = `
  query SERVER_STATUS_QUERY {
    serverStatus {
      online
      hostname
      version
      os
      type
      map
      onlinePlayers {
        ${onPlayer}
      }
    }
  }
`;

const ADMINS_QUERY = `
  query ADMINS_QUERY {
    admins {
      ${onPlayer}
    }
  }
`;

const VIPS_QUERY = `
  query VIPS_QUERY {
    vips {
      ${onPlayer}
    }
  }
`;

const IS_LOGGED_QUERY = `
  query IS_LOGGED_QUERY($token: String!) {
    isLogged(token: $token)
  }
`;

export {
  SEARCH_PLAYERS_QUERY,
  SERVER_STATUS_QUERY,
  ADMINS_QUERY,
  VIPS_QUERY,
  IS_LOGGED_QUERY
};
