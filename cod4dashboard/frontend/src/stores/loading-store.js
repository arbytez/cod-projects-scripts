import { writable } from 'svelte/store';

const loading = writable(false);

const customLoading = {
  subscribe: loading.subscribe,
  setLoading: loadingState => {
    loading.set(loadingState);
  }
};

export default customLoading;
