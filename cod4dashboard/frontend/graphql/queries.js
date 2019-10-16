import gql from 'graphql-tag';

const ME_QUERY = gql`
  query ME_QUERY {
    me {
      user {
        id
        username
        email
        roles
      }
      token
    }
  }
`;

const CODSERVERSTATUS_QUERY = gql`
  query CODSERVERSTATUS_QUERY($fullInfo: Boolean = false) {
    codServerStatus(fullInfo: $fullInfo) {
      online
      ip
      port
      hostname
      map
      gametype
      maxclients
      upTime
      mapStartTime
      version
      privateClients
      modName
      onlinePlayers {
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
      }
    }
  }
`;

export { ME_QUERY, CODSERVERSTATUS_QUERY };
