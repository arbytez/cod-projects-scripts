import Head from 'next/head';

import '../../styles/tailwind.css';
import Header from './Header';

function Layout({ children, user }) {
  return (
    <>
      <Head>
        {/* Stylesheets */}
        <title>Cod4Dashboard</title>
      </Head>
      <Header user={user} />
      <section className="container mx-auto px-2 py-1">{children}</section>
    </>
  );
}

export default Layout;
