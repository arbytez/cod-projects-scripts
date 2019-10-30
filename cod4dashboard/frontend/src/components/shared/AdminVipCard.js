import React from 'react';
import PropTypes from 'prop-types';
import { format, formatDistanceToNow, parse, toDate } from 'date-fns';

import catchErrors from '../../utils/catchErrors';

const XIcon = ({
  guids,
  guidToDelete,
  playerName,
  playerId,
  updateFunc,
  refetchFunc
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (
      confirm(
        `Are you sure you want to delete guid ${guidToDelete} for player ${playerName}?`
      )
    ) {
      try {
        setLoading(true);
        const newGuids = guids.filter(guid => guid !== guidToDelete);
        await updateFunc({ variables: { id: playerId, guids: newGuids } });
        await refetchFunc();
      } catch (error) {
        catchErrors(error, alert);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <i
      className="ml-2 text-black cursor-pointer hover:text-gray-700"
      onClick={handleClick}
      disabled={loading}
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
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </i>
  );
};

const PlayerProperty = ({ title, value1, value2 = '' }) => {
  return (
    <div className="py-1 px-2">
      <p className="font-semibold">{title}</p>
      {value2 ? (
        <div className="flex flex-wrap flex-col">
          <p>{value1}</p>
          <p>{value2}</p>
        </div>
      ) : (
        <p>{value1}</p>
      )}
    </div>
  );
};

function AdminVipCard({ player, index, deleteFunc, refetchFunc, updateFunc }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [guidToAdd, setGuidToAdd] = React.useState('');
  let {
    id = '--',
    createdAt = new Date().toISOString(),
    guids = [],
    name = '--',
    updatedAt = new Date().toISOString()
  } = player;

  async function handleAddNewGuid() {
    try {
      setLoading(true);
      await updateFunc({
        variables: { id, guids: [...guids, guidToAdd] }
      });
      await refetchFunc();
    } catch (error) {
      catchErrors(error, alert);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      if (confirm(`Are you sure you want to delete player ${name}?`)) {
        await deleteFunc({
          variables: { id }
        });
      }
      await refetchFunc();
    } catch (error) {
      catchErrors(error, alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`${
        index % 2 ? 'bg-blue-100' : 'bg-white'
      } m-1 py-1 px-2 shadow`}
    >
      <div className="flex flex-wrap justify-between items-start">
        <PlayerProperty title="ID" value1={id} />
        <PlayerProperty title="Name" value1={name} />
        <PlayerProperty
          title="CreatedAt"
          value1={format(
            new Date(Date.parse(createdAt)),
            'dd/MM/yyyy HH:mm:ss'
          )}
          value2={`${formatDistanceToNow(new Date(Date.parse(createdAt)))} ago`}
        />
        <PlayerProperty
          title="UpdatedAt"
          value1={format(
            new Date(Date.parse(updatedAt)),
            'dd/MM/yyyy HH:mm:ss'
          )}
          value2={`${formatDistanceToNow(new Date(Date.parse(updatedAt)))} ago`}
        />
      </div>
      <p className="mt-4 py-1 px-2 font-semibold">Guids ({guids.length})</p>
      <ul className="flex flex-wrap justify-start items-start">
        {guids.map((guid, i) => {
          return (
            <li className="flex flex-wrap items-center justify-start" key={i}>
              <div className="m-1 px-2 py-1 bg-indigo-200 rounded-lg">
                <div className="inline-flex items-center justify-between">
                  <span>{guid}</span>
                  <XIcon
                    guids={guids}
                    guidToDelete={guid}
                    playerName={name}
                    playerId={id}
                    updateFunc={updateFunc}
                    refetchFunc={refetchFunc}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="sm:flex sm:flex-wrap sm:items-center sm:justify-start mt-2 mb-2">
        <p className="font-semibold ml-2 content-start">Add new guid:</p>
        <input
          type="text"
          className="ml-2 sm:ml-4 my-2 form-input bg-gray-100"
          name="input-guid"
          value={guidToAdd}
          onChange={e => {
            setGuidToAdd(e.target.value);
          }}
        />
        <button
          className="btn ml-4 my-2"
          disabled={loading}
          onClick={handleAddNewGuid}
        >
          Add
        </button>
      </div>
      <button
        className="btn btn-danger mb-2 ml-2"
        disabled={loading}
        onClick={handleDelete}
      >
        DELETE
      </button>
    </div>
  );
}

AdminVipCard.defaultProps = {
  player: {},
  index: 0
};

AdminVipCard.propTypes = {
  player: PropTypes.object,
  index: PropTypes.number,
  deleteFunc: PropTypes.func,
  refetchFunc: PropTypes.func,
  updateFunc: PropTypes.func
};

export default AdminVipCard;
