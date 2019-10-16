import React from 'react';

import { getGraphQlError } from '../../helpers/utils';

const ErrorMessage = ({ error }) => {
  const errorMessage = getGraphQlError(error);
  return (
    <div
      className="font-semibold bg-red-700 rounded-lg"
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
