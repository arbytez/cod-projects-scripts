import React from 'react';

import Layout from '../components/_App/Layout';
import ServerStatus from '../components/Status/ServerStatus';

function StatusPage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">Server Status</h3>
      <div className="mt-4">
        <ServerStatus />
      </div>
    </>
  );
}

StatusPage.getLayout = page => <Layout>{page}</Layout>;

export default StatusPage;
