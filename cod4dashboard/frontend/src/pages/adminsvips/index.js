import React from 'react';

import Layout from '../../components/_App/Layout';
import AdminsVipsLayout from '../../components/_App/AdminsVipsLayout';
import AdminsVips from '../../components/AdminsVips/AdminsVips';

function AdminsVipsPage() {
  return (
    <>
      <div className="mt-4">
        <AdminsVips />
      </div>
    </>
  );
}

AdminsVipsPage.getLayout = page => {
  const { props = {} } = page;
  return (
    <Layout {...props}>
      <AdminsVipsLayout>{page}</AdminsVipsLayout>
    </Layout>
  );
};

export default AdminsVipsPage;
