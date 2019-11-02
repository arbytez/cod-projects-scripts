function catchErrors(error, displayError) {
  displayError(getErrorMessage(error));
}

export const getErrorMessage = error => {
  let errorMsg;
  switch (typeof error) {
    case 'string':
      return error;
    case 'object':
      if (!error || !error.message) {
        return '';
      }
      if (
        error.networkError &&
        error.networkError.result &&
        error.networkError.result.errors.length
      ) {
        errorMsg = error.networkError.result.errors[0].message;
      }
      if (!errorMsg) {
        errorMsg = error.message;
      }
      errorMsg = errorMsg
        .replace('GraphQL error: ', '')
        .replace('Network error: ', '')
        .replace(
          'Unexpected token T in JSON at position 0',
          'Too many requests, please try again later.'
        );
      const errorParsed = errorMsg.match(/^(.*): {".*$/);
      if (errorParsed) {
        errorMsg = errorParsed[1];
      }
      return errorMsg;
    case 'undefined':
      return '';
    default:
      return 'Something has failed.';
  }
};

export default catchErrors;
