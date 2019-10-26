import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Footer from './Footer';
import { handleLogout } from '../../utils/auth';

function Header(props) {
  const { auth } = props;
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <div className="bg-gray-200">
      <div id="nav" className="bg-white shadow">
        <div className="md:px-8">
          <nav className="relative flex flex-wrap items-center justify-between md:py-4">
            <div className="relative z-10 flex-shrink-0 pl-4 py-4 md:p-0 cursor-pointer">
              <Link href="/">
                <img
                  className="h-8 w-8"
                  src="https://via.placeholder.com/25"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="flex-shrink-0 pr-4 md:hidden">
              <button
                onClick={() => setIsExpanded(true)}
                type="button"
                className="block text-gray-600 focus:outline-none focus:text-gray-900"
                aria-label="Menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6Z" />
                  <path d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z" />
                  <path d="M4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H4Z" />
                </svg>
              </button>
            </div>
            <div className="hidden md:block md:ml-10 md:flex md:items-baseline md:justify-between md:bg-transparent">
              <div className="lg:absolute inset-0 flex items-center justify-center">
                <Link href="/">
                  <a
                    className={`${
                      isActive('/') ? 'underline' : ''
                    } text-sm font-medium text-gray-900 hover:text-gray-700`}
                  >
                    App
                  </a>
                </Link>
                <Link href="/about">
                  <a
                    className={`${
                      isActive('/about') ? 'underline' : ''
                    } ml-10 text-sm font-medium text-gray-900 hover:text-gray-700`}
                  >
                    About
                  </a>
                </Link>
              </div>
              <div className="ml-10 relative flex items-baseline">
                {!auth.isAuth ? (
                  <>
                    <Link href="/login">
                      <a
                        className={`${
                          isActive('/login') ? 'underline' : ''
                        } text-sm font-medium text-gray-900 hover:text-gray-700`}
                      >
                        Log in
                      </a>
                    </Link>
                    <Link href="/signup">
                      <a
                        className={`${
                          isActive('/signup') ? 'underline' : ''
                        } ml-8 px-3 py-2 font-medium text-center text-sm rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400 focus:outline-none focus:bg-gray-400`}
                      >
                        Create Account
                      </a>
                    </Link>
                  </>
                ) : (
                  <span
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                  >
                    Sign Out
                  </span>
                )}
              </div>
            </div>
          </nav>
        </div>

        <div className="md:hidden">
          {isExpanded && (
            <div className="z-10 fixed inset-0 transition-opacity">
              <div
                onClick={() => setIsExpanded(false)}
                className="absolute inset-0 bg-black opacity-50"
                tabIndex="-1"
              ></div>
            </div>
          )}
          {isExpanded && (
            <div className="z-10 fixed inset-y-0 right-0 max-w-xs w-full bg-white transition-transform overflow-y-auto">
              <div className="relative z-10 bg-white">
                <div
                  className={`${
                    isExpanded ? 'block' : 'hidden'
                  } absolute top-0 right-0 p-4`}
                >
                  <button
                    onClick={() => setIsExpanded(false)}
                    type="button"
                    className="text-gray-600 focus:outline-none focus:text-gray-900"
                    aria-label="Close"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L12 10.5858L5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L12 13.4142L18.2929 19.7071Z" />
                    </svg>
                  </button>
                </div>
                <div className="px-4 pt-4 pb-6">
                  <Link href="/">
                    <img
                      className="h-8 w-8 cursor-pointer"
                      src="https://via.placeholder.com/25"
                      alt="logo"
                    />
                  </Link>
                  <Link href="/">
                    <a
                      className={`${
                        isActive('/') ? 'underline' : ''
                      } mt-8 block font-medium text-gray-900 hover:text-gray-700`}
                    >
                      App
                    </a>
                  </Link>
                  <Link href="/about">
                    <a
                      className={`${
                        isActive('/about') ? 'underline' : ''
                      } mt-4 block font-medium text-gray-900 hover:text-gray-700`}
                    >
                      About
                    </a>
                  </Link>
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-6">
                  <Link href="#">
                    <a className="block font-medium text-gray-900 hover:text-gray-700">
                      Todo 1
                    </a>
                  </Link>
                  <Link href="#">
                    <a className="mt-4 block font-medium text-gray-900 hover:text-gray-700">
                      Todo 2
                    </a>
                  </Link>
                </div>
              </div>
              <div className="relative bg-white">
                {!auth.isAuth ? (
                  <>
                    <div className="px-4 pt-4 pb-6">
                      <Link href="/login">
                        <a
                          className={`${
                            isActive('/login') ? 'underline' : ''
                          } block font-medium text-gray-900 hover:text-gray-700`}
                        >
                          Log in
                        </a>
                      </Link>
                    </div>
                    <div className="p-4">
                      <Link href="/signup">
                        <a
                          className={`${
                            isActive('/signup') ? 'underline' : ''
                          } block px-3 py-3 font-medium text-center bg-gray-300 rounded-lg text-gray-900 hover:bg-gray-400 focus:outline-none focus:bg-gray-400`}
                        >
                          Create Account
                        </a>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-4 pt-4 pb-6">
                    <span
                      onClick={handleLogout}
                      className="block font-medium text-gray-900 hover:text-gray-700"
                    >
                      Sign Out
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {!isExpanded && (
        <div className="fixed bottom-0 w-full">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Header;
