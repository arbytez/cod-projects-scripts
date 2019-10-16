import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { handleLogout } from '../../helpers/auth';
import { SIGNOUT_MUTATION } from '../../graphql/mutations';

function AccountDropdown({ user }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [signOut, { loading, error }] = useMutation(SIGNOUT_MUTATION);

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
    } finally {
      handleLogout();
    }
  };

  return (
    <div className="relative hidden sm:block sm:ml-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 block h-8 w-8 focus:outline-none stroke-current text-gray-400 focus:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          tabIndex="-1"
          className="fixed inset-0 h-full w-full bg-black opacity-50 cursor-default"
        ></button>
      )}
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
          <span className="block px-4 py-2 text-gray-800 font-semibold">
            {user.username}
          </span>
          <hr className="mb-1" />
          <a
            href="#"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
          >
            Account settings
          </a>
          <a
            onClick={logout}
            href="#"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}

export default AccountDropdown;
