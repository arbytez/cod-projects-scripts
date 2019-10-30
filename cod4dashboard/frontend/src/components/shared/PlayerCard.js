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

function PlayerCard({ player, index }) {
  const [isOpen, setIsOpen] = React.useState(true);
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
  playerGUID = playerGUID || '--';
  adminName = adminName || '--';
  aliases = aliases || '';
  connections = connections || 0;
  deaths = deaths || 0;
  firstActivityDate = firstActivityDate || 0;
  firstActivityIP = firstActivityIP || '--';
  headShots = headShots || 0;
  isAdmin = isAdmin || 0;
  isVip = isVip || 0;
  kills = kills || 0;
  lastActivityDate = lastActivityDate || 0;
  name = name || '--';
  online = online || 0;
  onlineTime = onlineTime || 0;
  pid = pid || '';
  ping = ping || 0;
  playerID = playerID || '--';
  playerIP = playerIP || '--';
  port = port || '--';
  punishmentScore = punishmentScore || 0;
  score = score || 0;
  selfKills = selfKills || 0;
  steamid = steamid || '--';
  teamDeaths = teamDeaths || 0;
  teamKills = teamKills || 0;
  vipName = vipName || '--';
  const aliasesArray = aliases.split(',').filter(alias => alias);
  return (
    <ul
      className={`${
        index % 2 ? 'bg-blue-100' : 'bg-white'
      } m-1 py-1 px-2 shadow`}
    >
      <div className="mt-1 px-2">
        <div className="flex flex-wrap justify-between items-center">
          <p className="font-semibold pr-2">Aliases ({aliasesArray.length})</p>
          {isVip ? (
            <div className="flex font-semibold">
              <span className="px-2 bg-yellow-400 border border-black border-r-0 rounded-l-lg">
                VIP
              </span>
              <span className="px-2 bg-white border border-black rounded-r-lg">
                {vipName}
              </span>
            </div>
          ) : null}
          {isAdmin ? (
            <div className="flex font-semibold">
              <span className="px-2 bg-red-400 border border-black border-r-0 rounded-l-lg">
                ADMIN
              </span>
              <span className="px-2 bg-white border border-black rounded-r-lg">
                {adminName}
              </span>
            </div>
          ) : null}
        </div>
        {aliasesArray.length > 0 && (
          <button
            className="m-1 p-1 underline italic cursor-pointer focus:shadow-outline"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? 'Hide aliases' : 'Show aliases'}
          </button>
        )}
        {isOpen && aliasesArray.length > 0 && (
          <ul className="flex flex-wrap justify-start items-center">
            {aliasesArray.map((alias, i) => {
              return (
                <li
                  className="flex flex-wrap items-center justify-start"
                  key={i}
                >
                  <span className="m-1 px-2 py-1 bg-gray-300 rounded-lg">
                    {alias}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
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
        <PlayerProperty title="First player IP" value1={firstActivityIP} />
        <PlayerProperty title="Last player IP" value1={playerIP} />
        <PlayerProperty title="Connections" value1={connections} />
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
  player: {},
  index: 0
};

PlayerCard.propTypes = {
  player: PropTypes.object,
  index: PropTypes.number
};

export default PlayerCard;
