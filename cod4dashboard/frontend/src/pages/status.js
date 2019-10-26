import React from 'react';

import Layout from '../components/_App/Layout';

function StatusPage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">StatusPage</h3>

      <p className="mt-8">StatusPage page</p>
    </>
  );
}

StatusPage.getLayout = page => <Layout>{page}</Layout>;

export default StatusPage;
