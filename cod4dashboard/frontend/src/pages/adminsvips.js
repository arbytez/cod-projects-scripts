import React from 'react';

import Layout from '../components/_App/Layout';
import AdminsVips from '../components/AdminsVips/AdminsVips';

function AdminsVipsPage() {
  return (
    <>
      <h3 className="text-2xl font-semibold">Admins &amp; Vips</h3>
      <div className="mt-8">
        <AdminsVips />
      </div>
    </>
  );
}

AdminsVipsPage.getLayout = page => <Layout>{page}</Layout>;

export default AdminsVipsPage;
