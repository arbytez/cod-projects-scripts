import App from 'next/app';
import React from 'react';
import Router from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import { ApolloProvider } from '@apollo/react-hooks';
import axios from 'axios';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Layout from '../components/_App/Layout';
import { redirectUser } from '../helpers/auth';
import withData from '../components/hoc/withData';
import { ME_QUERY } from '../graphql/queries';

// react-alert options
const reactAlertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '10px',
  transition: transitions.FADE
};

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
      if (ctx.pathname.startsWith('/login')) {
        redirectUser(ctx, '/');
      }
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
        <AlertProvider template={AlertTemplate} {...reactAlertOptions}>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </AlertProvider>
      </ApolloProvider>
    );
  }
}

export default withData(MyApp);
