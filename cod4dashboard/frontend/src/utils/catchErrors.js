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
        return 'Something has failed.';
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
        .replace('Network error: ', '');
      return errorMsg;
    default:
      return 'Something has failed.';
  }
};

export default catchErrors;
