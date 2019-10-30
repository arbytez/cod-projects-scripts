import React from 'react';

import {
  VipPlayersComponent,
  useDeleteVipPlayerMutation,
  useUpdateVipPlayerMutation,
  useCreateVipPlayerMutation
} from '../../generated/js/graphql';
import AdminVipCard from '../shared/AdminVipCard';
import catchErrors from '../../utils/catchErrors';
import ErrorMessage from '../shared/ErrorMessage';

function EditVips() {
  const [nameNewVip, setNameNewVip] = React.useState('');
  const [newAddLoading, setNewAddLoading] = React.useState(false);
  const [deleteVipFunc] = useDeleteVipPlayerMutation();
  const [updateVipFunc] = useUpdateVipPlayerMutation();
  const [createVipFunc] = useCreateVipPlayerMutation();
  let vipPlayers = [];

  async function handleAddNewVip(refetchVipFunc) {
    try {
      setNewAddLoading(true);
      await createVipFunc({ variables: { name: nameNewVip } });
      await refetchVipFunc();
      setNameNewVip('');
    } catch (error) {
      catchErrors(error, alert);
    } finally {
      setNewAddLoading(false);
    }
  }

  return (
    <VipPlayersComponent>
      {({ loading, data, error, refetch: refetchVipFunc }) => {
        if (loading) return <p>Loading...</p>;
        if (error || !data || !data.vipPlayers) {
          vipPlayers = [];
        } else {
          vipPlayers = data.vipPlayers;
        }
        return (
          <>
            <div className="sm:flex sm:items-center sm:justify-between">
              <h4 className="ml-4 text-xl font-semibold">
                Vips ({vipPlayers.length})
              </h4>
              <div className="my-4 ml-1 sm:m-0 flex items-center">
                <input
                  type="text"
                  className="form-input"
                  disabled={loading || newAddLoading}
                  placeholder="vip name"
                  name="input-new-vip"
                  value={nameNewVip}
                  onChange={e => {
                    setNameNewVip(e.target.value);
                  }}
                />
                <button
                  className="btn btn-primary ml-4 mr-1"
                  onClick={async () => {
                    try {
                      await handleAddNewVip(refetchVipFunc);
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
              {vipPlayers.map((vipPlayer, i) => {
                return (
                  <div className="mt-2" key={i}>
                    <AdminVipCard
                      index={i}
                      player={vipPlayer}
                      deleteFunc={deleteVipFunc}
                      updateFunc={updateVipFunc}
                      refetchFunc={refetchVipFunc}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
    </VipPlayersComponent>
  );
}

export default EditVips;
