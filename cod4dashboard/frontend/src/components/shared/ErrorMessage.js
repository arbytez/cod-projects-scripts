import React from 'react';
import PropTypes from 'prop-types';

function ErrorMessage(props) {
  const { message } = props;
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

ErrorMessage.propTypes = {
  error: PropTypes.string
};

export default ErrorMessage;
