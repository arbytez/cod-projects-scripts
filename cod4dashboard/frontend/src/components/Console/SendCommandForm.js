import React from 'react';
import { useMount } from 'react-use';

import useClient from '../../graphql/client';
import catchErrors from '../../utils/catchErrors';
import ErrorMessage from '../shared/ErrorMessage';

function SendCommandForm() {
  const client = useClient();
  const inputEl = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [rconCmd, setRconCmd] = React.useState('');
  const [rconResp, setRconResp] = React.useState(
    'Commands responses will be shown here.'
  );

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setLoading(true);
      await sendRcon(rconCmd);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const sendRcon = async command => {
    try {
      setLoading(true);
      const { sendRconCommand } = await client.SendRconCommand({
        command
      });
      setRconResp(sendRconCommand);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  };

  useMount(() => {
    inputEl.current.focus();
  });

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between w-full sm:w-3/4 md:w-2/3 lg:w-3/5 mx-auto"
      >
        <input
          type="text"
          required
          disabled={loading}
          className="inline-block form-input w-full"
          placeholder="send rcon command"
          value={rconCmd}
          ref={inputEl}
          onChange={e => {
            setRconCmd(e.target.value);
          }}
        />
        <button
          type="submit"
          className="btn btn-primary ml-2 inline-block"
          disabled={loading}
        >
          Send
        </button>
      </form>
      <div className="mt-4 sm:flex justify-center items-center flex-wrap">
        <button
          className="btn m-1"
          disabled={loading}
          onClick={() => {
            setRconCmd('status');
            sendRcon('status');
          }}
        >
          status
        </button>
        <button
          className="btn m-1"
          disabled={loading}
          onClick={() => {
            setRconCmd('ministatus');
            sendRcon('ministatus');
          }}
        >
          ministatus
        </button>
        <button
          className="btn m-1"
          disabled={loading}
          onClick={() => {
            setRconCmd('dumpbanlist');
            sendRcon('dumpbanlist');
          }}
        >
          dumpbanlist
        </button>
        <button
          className="btn m-1"
          disabled={loading}
          onClick={() => {
            setRconCmd('cvarlist');
            sendRcon('cvarlist');
          }}
        >
          cvarlist
        </button>
      </div>
      <div className="mt-4">
        <ErrorMessage error={error} />
        <style jsx>{`
          #rcon-resp {
            height: 67vh;
          }
          @media (max-width: 640px) {
            #rcon-resp {
              height: 62vh;
            }
          }
        `}</style>
        <div
          name="rcon-command-responses"
          id="rcon-resp"
          className="mt-2 bg-gray-300 rounded overflow-x-hidden"
        >
          <pre className="p-3 text-xs overflow-y-auto h-full w-full">
            {rconResp}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SendCommandForm;
