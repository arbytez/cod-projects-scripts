import React from 'react';

import OnlinePlayer from './OnlinePlayer';

function ServerOnlinePlayers({ players = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full min-h-full">
        <thead className="bg-gray-400 shadow-lg rounded">
          <tr>
            <th scope="col" className="px-2 py-2">
              info
            </th>
            <th scope="col" className="px-8 py-2">
              num
            </th>
            <th scope="col" className="px-8 py-2">
              score
            </th>
            <th scope="col" className="px-8 py-2">
              ping
            </th>
            <th scope="col" className="px-8 py-2">
              playerid
            </th>
            <th scope="col" className="px-8 py-2">
              steamid
            </th>
            <th scope="col" className="px-8 py-2">
              name
            </th>
            <th scope="col" className="px-8 py-2">
              address
            </th>
          </tr>
        </thead>
        <tbody className="">
          {players.map((player, i) => {
            return <OnlinePlayer key={i} index={i} player={player} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ServerOnlinePlayers;
