import React from 'react';

import Layout from '../components/_App/Layout';

function About() {
  return (
    <>
      <h3 className="text-2xl font-semibold">About</h3>

      <p className="mt-8">About page</p>
    </>
  );
}

About.getLayout = page => <Layout>{page}</Layout>;

export default About;
