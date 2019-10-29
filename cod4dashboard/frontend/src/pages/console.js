import React from 'react';

import Layout from '../components/_App/Layout';
import SendCommandForm from '../components/Console/SendCommandForm';

function ConsolePage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">Console</h3>
      <div className="mt-4">
        <SendCommandForm />
      </div>
    </>
  );
}

ConsolePage.getLayout = page => <Layout>{page}</Layout>;

export default ConsolePage;
