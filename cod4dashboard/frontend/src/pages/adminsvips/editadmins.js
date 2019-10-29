import React from 'react';

import Layout from '../../components/_App/Layout';
import AdminsVipsLayout from '../../components/_App/AdminsVipsLayout';
import EditAdmins from '../../components/AdminsVips/EditAdmins';

function EditAdminsPage() {
  return (
    <>
      <div className="mt-4">
        <EditAdmins />
      </div>
    </>
  );
}

EditAdminsPage.getLayout = page => {
  const { props = {} } = page;
  return (
    <Layout {...props}>
      <AdminsVipsLayout>{page}</AdminsVipsLayout>
    </Layout>
  );
};

export default EditAdminsPage;
