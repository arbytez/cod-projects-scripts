import React from 'react';

import Layout from '../components/_App/Layout';
import LoginForm from '../components/Login/LoginForm';

const LoginPage = () => {
  return (
    <>
      <h3 className="text-2xl font-semibold">Login</h3>
      <div className="mt-8">
        <LoginForm />
      </div>
    </>
  );
};

LoginPage.getLayout = page => <Layout>{page}</Layout>;

export default LoginPage;
