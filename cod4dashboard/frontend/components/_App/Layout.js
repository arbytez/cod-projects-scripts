import Head from 'next/head';

import '../../styles/tailwind.css';
import withContext from '../hoc/withContext';
import Header from './Header';
import Loader from './Loader';

function Layout({ children, user }) {
  return (
    <>
      <Head>
        {/* Stylesheets */}
        <title>Cod4Dashboard</title>
      </Head>
      <Header user={user} />
      <Loader />
      <section className="container mx-auto px-2 py-1">{children}</section>
    </>
  );
}

export default withContext(Layout);
