import React from 'react';
import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';

import { formatDuration } from '../../utils/utils';

const PlayerProperty = ({ title, value1, value2 = '' }) => {
  return (
    <div className="mt-1 py-1 px-2">
      <p className="font-semibold">{title}</p>
      {value2 ? (
        <div className="flex flex-wrap flex-col">
          <p>{value1}</p>
          <p>{value2}</p>
        </div>
      ) : (
        <p>{value1}</p>
      )}
    </div>
  );
};

function PlayerCard({ player }) {
  console.log(player);
  let {
    playerGUID = '--',
    adminName = '--',
    aliases = '',
    connections = 0,
    deaths = 0,
    firstActivityDate,
    firstActivityIP = '--',
    headShots = 0,
    isAdmin = 0,
    isVip = 0,
    kills = 0,
    lastActivityDate,
    name = '--',
    online = 0,
    onlineTime = 0,
    pid,
    ping,
    playerID = '--',
    playerIP = '--',
    port = '--',
    punishmentScore,
    score,
    selfKills = 0,
    steamid = '--',
    teamDeaths = 0,
    teamKills = 0,
    vipName = '--'
  } = player;
  const aliasesArray = aliases.split(',');
  return (
    <ul className="m-1 py-1 px-2 bg-blue-200">
      <div className="mt-1 px-2">
        <div className="flex flex-wrap justify-between items-center">
          <p className="font-semibold pr-2">Aliases:</p>
          {isVip ? <p className="font-semibold">VIP {vipName}</p> : null}
          {isAdmin ? <p className="font-semibold">ADMIN {adminName}</p> : null}
        </div>
        <ul className="flex flex-wrap justify-start items-center">
          {aliasesArray.map((alias, i) => {
            return <li key={i}>{alias}</li>;
          })}
        </ul>
      </div>
      <div className="flex flex-wrap justify-start items-start">
        <PlayerProperty title="GUID" value1={playerGUID} />
        <PlayerProperty title="ID" value1={playerID} />
        <PlayerProperty
          title="Online time"
          value1={formatDuration(onlineTime * 1000)}
        />
        <PlayerProperty
          title="First connection"
          value1={format(
            new Date(firstActivityDate * 1000),
            'dd/MM/yyyy HH:mm:ss'
          )}
          value2={`${formatDistanceToNow(
            new Date(firstActivityDate * 1000)
          )} ago`}
        />
        <PlayerProperty
          title="Last seen online"
          value1={format(
            new Date(lastActivityDate * 1000),
            'dd/MM/yyyy HH:mm:ss'
          )}
          value2={`${formatDistanceToNow(
            new Date(lastActivityDate * 1000)
          )} ago`}
        />
        <PlayerProperty title="Connections" value1={connections} />
        <PlayerProperty title="First player IP" value1={firstActivityIP} />
        <PlayerProperty title="Last player IP" value1={playerIP} />
        <PlayerProperty title="Kills" value1={kills} />
        <PlayerProperty title="Deaths" value1={deaths} />
        <PlayerProperty
          title="K/D Ratio"
          value1={
            deaths !== 0 ? Math.round((kills / deaths) * 100) / 100 : '--'
          }
        />
        <PlayerProperty title="HeadShots" value1={headShots} />
        <PlayerProperty title="SelfKills" value1={selfKills} />
        <PlayerProperty title="TeamKills" value1={teamKills} />
        <PlayerProperty title="TeamDeaths" value1={teamDeaths} />
      </div>
    </ul>
  );
}

PlayerCard.defaultProps = {
  player: {}
};

PlayerCard.propTypes = {
  player: PropTypes.object
};

export default PlayerCard;
