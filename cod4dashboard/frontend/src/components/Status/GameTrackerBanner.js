import React from 'react';

function GameTrackerBanner({ ip, port }) {
  return (
    <div>
      <a
        href={`https://www.gametracker.com/server_info/${ip}:${port}/`}
        target="_blank"
      >
        <img
          src={`https://cache.gametracker.com/server_info/${ip}:${port}/b_560_95_1.png`}
          border="0"
          width="560"
          height="95"
          alt=""
        />
      </a>
    </div>
  );
}

export default GameTrackerBanner;
