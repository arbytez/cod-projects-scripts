import App from 'next/app';
import { parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';
import { ApolloProvider } from 'react-apollo';

import { redirectUser } from '../utils/auth';
import { createNewGraphQlClient } from '../graphql/client';
import withData from '../components/hoc/withData';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.auth = {};

    if (!token) {
      if (!ctx.pathname.startsWith('/login')) {
        redirectUser(ctx, '/login');
      }
    } else {
      try {
        const { me } = await createNewGraphQlClient({
          headers: { authorization: token }
        }).Me();
        if (me && me.token && me.user) {
          const user = me.user;
          pageProps.auth = { user, isAuth: !!user };
        }
      } catch (error) {
        // console.error('Error getting current user', error);
        // 1) Throw out invalid token
        destroyCookie(ctx, 'token');
        // 2) Redirect to login
        // redirectUser(ctx, '/login');
        window.location.replace('/login');
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
  }

  syncLogout = event => {
    if (event.key === 'logout') {
      // console.log('logged out from storage');
      // Router.push('/login');
      window.location.replace('/login');
    }
  };

  render() {
    const { Component, pageProps, apollo } = this.props;
    const getLayout = Component.getLayout || (page => page);
    return (
      <ApolloProvider client={apollo}>
        {getLayout(<Component {...pageProps} />)}
      </ApolloProvider>
    );
  }
}

export default withData(MyApp);
