import { writable } from 'svelte/store';

const errorStore = writable([]);

const customOnlineErrorStore = {
  subscribe: errorStore.subscribe,
  setError: errorObj => {
    switch (typeof errorObj) {
      case 'number':
      case 'string':
      case 'boolean':
        errorStore.set([errorObj]);
        break;
      case 'object':
        if (errorObj.response) {
          if (errorObj.response.errors && errorObj.response.errors.length > 0) {
            errorStore.set([errorObj.response.errors[0].message]);
          }
        } else if (errorObj.message) {
          errorStore.set([errorObj.message]);
        } else {
          errorStore.set([]);
        }
        break;
      default:
        errorStore.set([]);
        break;
    }
  },
  resetError: () => {
    errorStore.set([]);
  }
};

export default customOnlineErrorStore;
