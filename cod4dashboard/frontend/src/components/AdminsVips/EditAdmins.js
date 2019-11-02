import React from 'react';

import {
  AdminPlayersComponent,
  useDeleteAdminPlayerMutation,
  useUpdateAdminPlayerMutation,
  useCreateAdminPlayerMutation
} from '../../generated/js/graphql';
import AdminVipCard from '../shared/AdminVipCard';
import catchErrors from '../../utils/catchErrors';
import ErrorMessage from '../shared/ErrorMessage';

function EditAdmins() {
  const [loading, setLoading] = React.useState(false);
  const [nameNewAdmin, setNameNewAdmin] = React.useState('');
  const [adminPlayers, setAdminPlayers] = React.useState([]);
  const [deleteAdminFunc] = useDeleteAdminPlayerMutation();
  const [updateAdminFunc] = useUpdateAdminPlayerMutation();
  const [createAdminFunc] = useCreateAdminPlayerMutation();

  async function handleAddNewAdmin(refetchAdminsFunc) {
    try {
      setLoading(true);
      await createAdminFunc({ variables: { name: nameNewAdmin } });
      await refetchAdminsFunc();
      setNameNewAdmin('');
    } catch (error) {
      catchErrors(error, alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminPlayersComponent>
      {({ loading: loadingQuery, data, error, refetch: refetchAdminsFunc }) => {
        if (loadingQuery) return <p>Loading...</p>;
        if (error || !data || !data.adminPlayers) {
          setAdminPlayers([]);
        } else {
          setAdminPlayers(data.adminPlayers);
        }
        return (
          <>
            <div className="sm:flex sm:items-center sm:justify-between">
              <h4 className="ml-4 text-xl font-semibold">
                Admins ({adminPlayers.length})
              </h4>
              <div className="right-0 my-4 ml-1 sm:m-0 flex items-center">
                <input
                  type="text"
                  className="form-input"
                  disabled={loading || loadingQuery}
                  placeholder="admin name"
                  name="input-new-admin"
                  value={nameNewAdmin}
                  onChange={e => {
                    setNameNewAdmin(e.target.value);
                  }}
                />
                <button
                  className="btn btn-primary ml-4 mr-1"
                  disabled={loading || loadingQuery}
                  onClick={async () => {
                    try {
                      await handleAddNewAdmin(refetchAdminsFunc);
                    } catch (error) {
                      catchErrors(error, alert);
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mt-4">
              <ErrorMessage error={error} />
              {adminPlayers.map((adminPlayer, i) => {
                return (
                  <div className="mt-2" key={i}>
                    <AdminVipCard
                      index={i}
                      player={adminPlayer}
                      deleteFunc={deleteAdminFunc}
                      updateFunc={updateAdminFunc}
                      refetchFunc={refetchAdminsFunc}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
    </AdminPlayersComponent>
  );
}

export default EditAdmins;
