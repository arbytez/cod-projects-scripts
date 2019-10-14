import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useMutation } from '@apollo/react-hooks';

import { handleLogout } from '../../helpers/auth';
import { SIGNOUT_MUTATION } from '../../graphql/mutations';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

function Header({ user }) {
  const router = useRouter();
  const [signOut, { loading, error }] = useMutation(SIGNOUT_MUTATION);

  const logout = async () => {
    try {
      const res = await signOut();
      console.log(res);
    } catch (error) {
    } finally {
      handleLogout();
    }
  };

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          {user && (
            <button disabled={loading} onClick={logout}>
              Sign Out
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Header;
