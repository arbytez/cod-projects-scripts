import React from 'react';
import { useMount } from 'react-use';

import catchErrors from '../../utils/catchErrors';
import ErrorMessage from '../shared/ErrorMessage';
import { useCodServerStatusQuery } from '../../generated/js/graphql';
import GameTrackerBanner from './GameTrackerBanner';
import ServerInfoCard from './ServerInfoCard';
import ServerOnlinePlayers from './ServerOnlinePlayers';

function ServerStatus() {
  const [fullInfo, setFullInfo] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [serverStatus, setServerStatus] = React.useState({});
  const {
    loading: loadingQuery,
    data,
    error: errorQuery,
    refetch: fetchServerStatus
  } = useCodServerStatusQuery({ variables: { fullInfo } });

  async function handleRefresh() {
    try {
      setLoading(true);
      await fetchServerStatus({
        variables: { fullInfo }
      });
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  useMount(() => {
    handleRefresh();
  });

  React.useEffect(() => {
    setError(errorQuery);
  }, [errorQuery]);

  React.useEffect(() => {
    handleRefresh();
  }, [fullInfo]);

  React.useEffect(() => {
    const { codServerStatus } = data || {};
    if (codServerStatus) {
      setServerStatus(codServerStatus);
    } else {
      setServerStatus({});
    }
  }, [data]);

  // if (loading || loadingQuery) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 text-teal-800"
            onChange={() => setFullInfo(!fullInfo)}
            checked={fullInfo}
          />
          <span className="ml-2">full info</span>
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRefresh}
          disabled={loading || loadingQuery}
        >
          Refresh
        </button>
      </div>
      <div className="mt-4">
        <ErrorMessage error={error} />
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold">General info</h4>
        <div className="mt-4 flex justify-center items-center">
          <GameTrackerBanner ip={serverStatus.ip} port={serverStatus.port} />
        </div>
        <div className="mt-4 bg-white rounded">
          <ServerInfoCard status={serverStatus} />
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">
            Online Players (
            {serverStatus.onlinePlayers && serverStatus.onlinePlayers.length})
          </h4>
          <div className="mt-4">
            <ServerOnlinePlayers players={serverStatus.onlinePlayers} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerStatus;
