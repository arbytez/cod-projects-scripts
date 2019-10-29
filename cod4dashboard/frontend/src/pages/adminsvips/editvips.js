import React from 'react';

import Layout from '../../components/_App/Layout';
import AdminsVipsLayout from '../../components/_App/AdminsVipsLayout';
import EditVips from '../../components/AdminsVips/EditVips';

function EditVipsPage() {
  return (
    <>
      <div className="mt-8">
        <EditVips />
      </div>
    </>
  );
}

EditVipsPage.getLayout = page => {
  const { props = {} } = page;
  return (
    <Layout {...props}>
      <AdminsVipsLayout>{page}</AdminsVipsLayout>
    </Layout>
  );
};

export default EditVipsPage;
