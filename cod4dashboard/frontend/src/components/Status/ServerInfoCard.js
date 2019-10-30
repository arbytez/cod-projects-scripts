import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';

import { removeCodColors } from '../../utils/utils';

const ServerProperty = ({ title, value1, value2 = '' }) => {
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

function ServerInfoCard({ status = {} }) {
  const {
    gametype = 'n/a',
    hostname = 'OFFLINE',
    ip = 'n/a',
    map = 'n/a',
    mapStartTime = new Date().toUTCString(),
    maxclients = 0,
    modName = 'n/a',
    online = false,
    onlinePlayers = [],
    port = 0,
    privateClients = 0,
    upTime = 'n/a',
    version = 'n/a'
  } = status;
  return (
    <div>
      <div className="flex flex-wrap items-start justify-start">
        <ServerProperty title="Hostname" value1={removeCodColors(hostname)} />
        <ServerProperty title="Version" value1={version} />
        <ServerProperty title="Ip" value1={ip} />
        <ServerProperty title="Port" value1={port} />
        <ServerProperty title="Max Clients" value1={maxclients} />
        <ServerProperty title="Private Clients" value1={privateClients} />
        <ServerProperty title="Up Time" value1={upTime} />
        <ServerProperty
          title="Map start time"
          value1={format(
            new Date(Date.parse(mapStartTime)),
            'dd/MM/yyyy HH:mm:ss'
          )}
          value2={`${formatDistanceToNow(
            new Date(Date.parse(mapStartTime))
          )} ago`}
        />
        <ServerProperty title="Mod Name" value1={modName} />
        <ServerProperty title="Gametype" value1={gametype} />
        <ServerProperty title="Map" value1={map} />
      </div>
    </div>
  );
}

export default ServerInfoCard;
