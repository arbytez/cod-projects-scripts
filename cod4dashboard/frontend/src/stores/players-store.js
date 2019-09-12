import { writable } from 'svelte/store';

const players = writable([]);

const customPlayersStore = {
  subscribe: players.subscribe,
  setPlayers: playersArray => {
    players.set(playersArray);
  },
  addPlayer: playerData => {
    const newPlayer = {
      ...playerData
    };
    players.update(items => {
      return [...items, newPlayer];
    });
  }
};

export default customPlayersStore;
