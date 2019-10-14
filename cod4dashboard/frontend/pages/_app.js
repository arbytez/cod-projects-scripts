import App from 'next/app';
import Router from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import { ApolloProvider } from '@apollo/react-hooks';
import axios from 'axios';

import Layout from '../components/_App/Layout';
import { redirectUser } from '../helpers/auth';
import withData from '../graphql/withData';
import { ME_QUERY } from '../graphql/queries';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const isProtectedRoute = ctx.pathname === '/';
      if (isProtectedRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      try {
        const payload = {
          query: ME_QUERY.loc.source.body
        };
        const { data } = await axios.post(process.env.ENDPOINT, payload, {
          headers: { authorization: token }
        });
        const user = (data.data.me && data.data.me.user) || null;
        pageProps.user = { ...user };
      } catch (error) {
        console.error(error);
        // 1) Throw out invalid token
        destroyCookie(ctx, 'token');
        // 2) Redirect to login
        redirectUser(ctx, '/login');
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
  }

  syncLogout = event => {
    if (event.key === 'logout') {
      console.log('logged out from storage');
      Router.push('/login');
    }
  };

  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    );
  }
}

export default withData(MyApp);
