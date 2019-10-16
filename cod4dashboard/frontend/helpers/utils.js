const getGraphQlError = error => {
  if (!error || !error.message) return '';
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    const errors = error.networkError.result.errors.map((error, i) =>
      error.message
        .replace('GraphQL error: ', '')
        .replace('Network error: ', '')
    );
    if (errors.length > 0) {
      return errors[0];
    } else {
      return '';
    }
  }
  return error.message
    .replace('GraphQL error: ', '')
    .replace('Network error: ', '');
};

export { getGraphQlError };
