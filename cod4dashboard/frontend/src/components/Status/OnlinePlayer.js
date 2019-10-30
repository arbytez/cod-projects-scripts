import React from 'react';

import PlayerCard from '../shared/PlayerCard';

function OnlinePlayer({ player = {}, index }) {
  const [showStats, setShowStats] = React.useState(false);
  const {
    pid = '',
    score = 0,
    ping = 0,
    playerGUID = '',
    steamid = '',
    name = '',
    playerIP = '',
    isAdmin = 0,
    isVip = 0,
    adminName = '',
    vipName = ''
  } = player;
  return (
    <tr className={`${index % 2 ? 'bg-white' : 'bg-gray-200'}`}>
      <td
        className="text-center mx-8 cursor-pointer"
        onClick={() => setShowStats(!showStats)}
      >
        info
        <div
          className={`${
            showStats ? 'block' : 'hidden'
          } absolute cursor-default`}
        >
          <PlayerCard index={0} player={player} />
        </div>
      </td>
      <td className="text-center mx-8">{pid}</td>
      <td className="text-center mx-8">{score}</td>
      <td className="text-center mx-8">{ping}</td>
      <td className="text-center mx-8">{playerGUID}</td>
      <td className="text-center mx-8">{steamid}</td>
      <td className="text-center mx-8">{name}</td>
      <td className="text-center mx-8">{playerIP}</td>
      {isVip ? (
        <td>
          <div className="flex font-semibold">
            <span className="px-2 bg-yellow-400 border border-black border-r-0 rounded-l-lg">
              VIP
            </span>
            <span className="px-2 bg-white border border-black rounded-r-lg">
              {vipName}
            </span>
          </div>
        </td>
      ) : null}
      {isAdmin ? (
        <td>
          <div className="flex font-semibold">
            <span className="px-2 bg-red-400 border border-black border-r-0 rounded-l-lg">
              ADMIN
            </span>
            <span className="px-2 bg-white border border-black rounded-r-lg">
              {adminName}
            </span>
          </div>
        </td>
      ) : null}
    </tr>
  );
}

export default OnlinePlayer;
