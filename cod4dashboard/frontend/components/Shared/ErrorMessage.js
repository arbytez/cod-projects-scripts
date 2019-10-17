import React from 'react';

import { getGraphQlError } from '../../helpers/utils';

const ErrorMessage = error => {
  const errorMessage = getGraphQlError(error.error);
  return (
    <div
      className="px-3 py-2 font-semibold bg-red-700 text-gray-100 rounded-lg"
      data-test="graphql-error"
    >
      {errorMessage}
    </div>
  );
};

ErrorMessage.defaultProps = {
  error: {}
};

export default ErrorMessage;
