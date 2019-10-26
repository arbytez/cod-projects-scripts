import React from 'react';

import Layout from '../components/_App/Layout';

function PlayersPage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">PlayersPage</h3>

      <p className="mt-8">PlayersPage page</p>
    </>
  );
}

PlayersPage.getLayout = page => <Layout>{page}</Layout>;

export default PlayersPage;
