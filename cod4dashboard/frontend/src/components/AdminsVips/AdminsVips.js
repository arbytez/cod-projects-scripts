import React from 'react';

import ErrorMessage from '../shared/ErrorMessage';
import { AdminsAndVipsComponent } from '../../generated/js/graphql';
import PlayerCard from '../shared/PlayerCard';
import catchErrors from '../../utils/catchErrors';

function AdminsVips() {
  const [loading, setLoading] = React.useState(false);
  const [admins, setAdmins] = React.useState([]);
  const [vips, setVips] = React.useState([]);
  return (
    <AdminsAndVipsComponent>
      {({ loading: loadingQuery, data, error, refetch }) => {
        if (loadingQuery) return <p>Loading...</p>;
        if (error || !data || !data.admins || !data.vips) {
          setAdmins([]);
          setVips([]);
        } else {
          setAdmins(data.admins);
          setVips(data.vips);
        }
        return (
          <div>
            <div className="flex flex-wrap justify-between items-center">
              <h4 className="ml-4 text-xl font-semibold">
                Admins ({admins.length})
              </h4>
              <button
                className="btn mr-4"
                disabled={loadingQuery || loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await refetch();
                  } catch (error) {
                    catchErrors(error, alert);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Refresh
              </button>
            </div>
            <div className="mt-4">
              <ErrorMessage error={error} />
              {admins.map((admin, i) => {
                return (
                  <div className="mt-2" key={i}>
                    <PlayerCard player={admin} index={i} />
                  </div>
                );
              })}
            </div>
            <div className="mt-5">
              <h4 className="ml-4 text-xl font-semibold">
                Vips ({vips.length})
              </h4>
              <div className="mt-5">
                <ErrorMessage error={error} />
                {vips.map((vip, i) => {
                  return <PlayerCard key={i} player={vip} index={i} />;
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
