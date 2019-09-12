import { writable } from 'svelte/store';

const onlinePlayers = writable([]);

const customOnlinePlayersStore = {
  subscribe: onlinePlayers.subscribe,
  setOnlinePlayers: onlinePlayersArray => {
    onlinePlayers.set(onlinePlayersArray);
  }
};

export default customOnlinePlayersStore;
