import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <div key={i}>
        <p data-test="graphql-error">
          {error.message
            .replace('GraphQL error: ', '')
            .replace('Network error: ', '')}
        </p>
      </div>
    ));
  }
  return (
    <div>
      <p data-test="graphql-error">
        {error.message
          .replace('GraphQL error: ', '')
          .replace('Network error: ', '')}
      </p>
    </div>
  );
};

ErrorMessage.defaultProps = {
  error: {}
};

export default ErrorMessage;
