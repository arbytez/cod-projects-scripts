import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { CODSERVERSTATUS_QUERY } from '../../graphql/queries';
import ErrorMessage from '../Shared/ErrorMessage';
import GametrackerBanner from './GametrackerBanner';
import Context from '../../state/context';

import tempdata from './tempdata.json';

let canStartLoading = true;

function ServerStatus({ fullInfo = false }) {
  const { state, dispatch } = React.useContext(Context);
  // if (canStartLoading && !state.loading) {
  //   dispatch({ type: 'START_LOADING' });
  //   canStartLoading = false;
  // }
  // let { loading, error, data, refetch } = useQuery(CODSERVERSTATUS_QUERY, {
  //   variables: { fullInfo },
  //   onCompleted: () => {
  //     dispatch({ type: 'STOP_LOADING' });
  //     canStartLoading = false;
  //   },
  //   onError: () => {
  //     dispatch({ type: 'STOP_LOADING' });
  //     canStartLoading = false;
  //   }
  // });
  let loading = false;
  let data = tempdata;
  let error = undefined;
  console.log(data);
  data = data || {};
  data.codServerStatus = data.codServerStatus || {};
  const {
    codServerStatus: {
      hostname,
      gametype,
      map,
      mapStartTime,
      maxclients,
      modName,
      online,
      onlinePlayers,
      privateClients,
      upTime,
      version,
      ip,
      port
    }
  } = data;
  return loading ? (
    <p>loading...</p>
  ) : error ? (
    <ErrorMessage error={error} />
  ) : (
    <div>
      <div className="flex items-center justify-center">
        <GametrackerBanner ip={ip} port={port} />
      </div>
      <button
        onClick={async () => {
          try {
            dispatch({ type: 'START_LOADING' });
            // await refetch({ fullInfo });
            canStartLoading = false;
          } catch (error) {
          } finally {
            dispatch({ type: 'STOP_LOADING' });
          }
        }}
        className="mt-4 btn"
        disabled={loading}
      >
        {loading ? 'Updating' : 'Update'}
      </button>
      <span className="ml-4">Full info: </span>
      <input
        type="checkbox"
        className="form-checkbox"
        checked={fullInfo}
        readOnly
      />
      <h3 className="mt-4 font-bold">Server Info</h3>
      <div className="mt-2 text-xs bg-gray-300 rounded p-1">
        <span className="font-semibold">Ip:</span>
        <span className="ml-2 font-normal">{ip}</span>
        <span className="ml-2 font-semibold">Port:</span>
        <span className="ml-2 font-normal">{port}</span>
        <p className="font-semibold">
          Hostname: <span className="font-normal">{hostname}</span>
        </p>
        <p className="font-semibold">
          Map: <span className="font-normal">{map}</span>
        </p>
        <p className="font-semibold">
          Gametype: <span className="font-normal">{gametype}</span>
        </p>
        <p className="font-semibold">
          UpTime: <span className="font-normal">{upTime}</span>
        </p>
        <p className="font-semibold">
          Version: <span className="font-normal">{version}</span>
        </p>
        <p className="font-semibold">
          MapStartTime: <span className="font-normal">{mapStartTime}</span>
        </p>
        <p className="font-semibold">
          ModName: <span className="font-normal">{modName}</span>
        </p>
        <p className="font-semibold">
          Maxclients: <span className="font-normal">{maxclients}</span>
        </p>
        <p className="font-semibold">
          PrivateClients: <span className="font-normal">{privateClients}</span>
        </p>
      </div>
      <h3 className="mt-4 font-bold">
        Online Players ({onlinePlayers.length})
      </h3>
      <div className="mt-2 text-xs bg-gray-300 rounded p-1">
        {onlinePlayers.map((player, i) => {
          const { name } = player;
          return <p key={i}>{name}</p>;
        })}
      </div>
    </div>
  );
}

export default ServerStatus;
