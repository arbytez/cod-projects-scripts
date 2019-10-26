import React from 'react';

import Layout from '../components/_App/Layout';

function Home() {
  return (
    <>
      <h3 className="text-2xl font-semibold">Home</h3>

      <p className="mt-8">Home page</p>
    </>
  );
}

Home.getLayout = page => <Layout>{page}</Layout>;

export default Home;
