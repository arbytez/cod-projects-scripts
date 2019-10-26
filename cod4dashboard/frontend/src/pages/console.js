import React from 'react';

import Layout from '../components/_App/Layout';

function ConsolePage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">ConsolePage</h3>

      <p className="mt-8">ConsolePage page</p>
    </>
  );
}

ConsolePage.getLayout = page => <Layout>{page}</Layout>;

export default ConsolePage;
