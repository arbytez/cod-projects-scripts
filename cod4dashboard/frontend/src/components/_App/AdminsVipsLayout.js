import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function AdminsVipsLayout(props) {
  const router = useRouter();

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <>
      <div className="my-4 mx-4 py-2 flex flex-wrap justify-between items-center bg-gray-300 rounded-lg shadow-lg font-semibold">
        <Link href="/adminsvips">
          <a
            className={`${
              isActive('/adminsvips') ? 'underline' : ''
            } px-4 py-2 hover:underline`}
          >
            Admins &amp; Vips
          </a>
        </Link>
        <Link href="/adminsvips/editadmins">
          <a
            className={`${
              isActive('/adminsvips/editadmins') ? 'underline' : ''
            } px-4 py-2 hover:underline`}
          >
            Edit Admins GUIDs
          </a>
        </Link>
        <Link href="/adminsvips/editvips">
          <a
            className={`${
              isActive('/adminsvips/editvips') ? 'underline' : ''
            } px-4 py-2 hover:underline`}
          >
            Edit Vips GUIDs
          </a>
        </Link>
      </div>
      {props.children}
    </>
  );
}

export default AdminsVipsLayout;
