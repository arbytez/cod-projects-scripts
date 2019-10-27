import React from 'react';

import ErrorMessage from '../shared/ErrorMessage';
import { AdminsAndVipsComponent } from '../../generated/js/graphql';
import PlayerCard from '../shared/PlayerCard';

function AdminsVips() {
  console.log('adminsvips comp called');
  return (
    <AdminsAndVipsComponent>
      {({ loading, data, error, refetch }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error!</p>;
        return (
          <div className="block mx-auto w-full sm:w-4/5 xl:w-2/3">
            <button
              className="btn"
              onClick={() => {
                refetch();
              }}
            >
              Refresh
            </button>
            <div className="mt-8">
              <ErrorMessage error={error} />
              <h4>Admins</h4>
              <div className="mt-4">
                {data.admins.map((admin, i) => {
                  return <PlayerCard key={i} player={admin} />;
                })}
              </div>
            </div>
          </div>
        );
      }}
    </AdminsAndVipsComponent>
  );
}

export default AdminsVips;
