import React from 'react';
import { useDebounce, useMount } from 'react-use';

import useClient from '../../graphql/client';
import catchErrors from '../../utils/catchErrors';
import ErrorMessage from '../shared/ErrorMessage';
import PlayerCard from '../shared/PlayerCard';

const PlayersSearch = () => {
  const client = useClient();
  const inputEl = React.useRef(null);
  const [val, setVal] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [players, setPlayers] = React.useState([]);

  useDebounce(
    () => {
      setDebouncedValue(val);
      if (val) {
        searchPlayers(val);
      }
    },
    1000,
    [val]
  );

  useMount(() => {
    inputEl.current.focus();
  });

  const searchPlayers = async search => {
    try {
      setLoading(true);
      const { searchPlayers } = await client.SearchPlayers({
        limit: 100,
        search,
        offset: 0
      });
      setPlayers(searchPlayers);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="block mx-auto w-full sm:w-3/4 md:w-3/5 lg:w-2/5">
        <input
          type="text"
          className="form-input w-full"
          disabled={loading}
          value={val}
          ref={inputEl}
          placeholder="search players by name or guid"
          onChange={({ currentTarget }) => {
            setVal(currentTarget.value);
          }}
        />
      </div>
      <div className="mt-4">
        <ErrorMessage error={error} />
        <ul className="mt-2">
          <p className="italic mt-1 mb-2 inline-block">
            Total results: {players.length}
          </p>
          {loading && (
            <div className="inline-block italic ml-8">Loading...</div>
          )}
          {players.map((player, i) => {
            return <PlayerCard key={i} player={player} index={i} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default PlayersSearch;
