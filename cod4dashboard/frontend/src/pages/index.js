import React from 'react';

import Layout from '../components/_App/Layout';
import PlayersSearch from '../components/Players/PlayersSearch';

function PlayersPage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">Players</h3>
      <div className="mt-4">
        <PlayersSearch />
      </div>
    </>
  );
}

PlayersPage.getLayout = page => <Layout>{page}</Layout>;

export default PlayersPage;
