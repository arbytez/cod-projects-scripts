import React from 'react';

import Layout from '../components/_App/Layout';

function SignUp() {
  return (
    <>
      <h3 className="text-2xl font-semibold">SignUp</h3>

      <p className="mt-8">SignUp page</p>
    </>
  );
}

SignUp.getLayout = page => <Layout>{page}</Layout>;

export default SignUp;
