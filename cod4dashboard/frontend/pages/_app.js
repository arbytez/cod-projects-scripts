import App from 'next/app';
import Layout from '../components/_App/Layout';
import { parseCookies, destroyCookie } from 'nookies';
import { redirectUser } from '../helpers/auth';
import Router from 'next/router';

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
        // TODO get user me
        pageProps.user = user;
      } catch (error) {
        console.error('Error getting current user', error);
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
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
