import React from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useMutation } from '@apollo/react-hooks';

import { handleLogout } from '../../helpers/auth';
import { SIGNOUT_MUTATION } from '../../graphql/mutations';
import AccountDropdown from './AccountDropdown';
import Loader from './Loader';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

function Header({ user }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const [signOut, { loading, error }] = useMutation(SIGNOUT_MUTATION);

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
    } finally {
      handleLogout();
    }
  };

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <header className="mb-5 bg-gray-700 sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-1">
      <div className="flex items-center justify-between px-4 py-1 sm:p-0">
        <div>
          <Link href="/">
            <img className="h-8 cursor-pointer" src="/cod4.png" alt="cod4" />
          </Link>
        </div>
        {user && (
          <div className="sm:hidden py-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>
      {user && (
        <nav className={`${isOpen ? 'block' : 'hidden'} sm:block`}>
          <div className="px-2 pt-2 pb-2 sm:flex sm:px-4">
            <a
              href="#"
              className="block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800"
            >
              Players
            </a>
            <a
              href="#"
              className="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2"
            >
              Online Players
            </a>
            <a
              href="#"
              className="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2"
            >
              Admins and Vips
            </a>
            <a
              href="#"
              className="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 mb-2 sm:mb-0 sm:mt-0 sm:ml-2"
            >
              Server Console
            </a>
            <AccountDropdown user={user} />
          </div>
          <div className="px-4 py-5 border-t border-gray-800 sm:hidden">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-current text-white"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="ml-3 font-semibold text-white">
                {user.username}
              </span>
            </div>
            <div className="mt-4">
              <a href="#" className="block text-gray-400 hover:text-white">
                Account settings
              </a>
              <a href="#" className="mt-2 block text-gray-400 hover:text-white">
                Support
              </a>
              <a
                onClick={logout}
                href="#"
                className="mt-2 block text-gray-400 hover:text-white"
              >
                Sign out
              </a>
            </div>
          </div>
        </nav>
      )}
      <Loader />
    </header>
  );
}

export default Header;
