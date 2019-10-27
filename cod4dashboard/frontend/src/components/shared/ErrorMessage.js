import React from 'react';

import { getErrorMessage } from '../../utils/catchErrors';

function ErrorMessage(props) {
  const { error } = props;
  const message = getErrorMessage(error);
  return (
    <>
      {message ? (
        <div className="bg-red-200 font-semibold text-red-800 shadow py-2 px-4 rounded-lg">
          {message}
        </div>
      ) : null}
    </>
  );
}

ErrorMessage.defaultProps = {
  error: ''
};

export default ErrorMessage;
