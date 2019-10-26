import Router from 'next/router';
import cookie from 'js-cookie';

import { createNewGraphQlClient } from '../graphql/client';

export function handleLogin(token) {
  cookie.set('token', token, { expires: 7 });
  // Router.push('/');
  window.location.replace('/');
}

export function redirectUser(ctx, location) {
  if (ctx.req) {
    if (ctx.res && ctx.res.writeHead) {
      ctx.res.writeHead(302, { Location: location });
      ctx.res.end();
    }
  } else {
    Router.push(location);
  }
}

export function handleLogout() {
  const token = cookie.get('token');
  cookie.remove('token');
  window.localStorage.setItem('logout', Date.now());
  if (token) {
    createNewGraphQlClient({
      headers: { authorization: token }
    }).SignOut();
  }
  // Router.push('/login');
  window.location.replace('/login');
}
