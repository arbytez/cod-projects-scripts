import React from 'react';

import Layout from '../components/_App/Layout';

function AdminsVipsPage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">AdminsVipsPage</h3>

      <p className="mt-8">AdminsVipsPage page</p>
    </>
  );
}

AdminsVipsPage.getLayout = page => <Layout>{page}</Layout>;

export default AdminsVipsPage;
