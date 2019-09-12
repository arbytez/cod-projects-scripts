<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  import Button from "./UI/Button.svelte";
  import loadingStore from "../stores/loading-store";
  import playersStore from "../stores/players-store";
  import Icon from "./UI/Icon.svelte";
  import Loader from "./UI/Loader.svelte";

  let inputValue = "";
  let unsubscribePlayersStore;
  let unsubscribeLoadingStore;
  let loadingState;
  let players;
  let inputForm;
  let focusTimeout;

  const dispatch = createEventDispatcher();

  onMount(() => {
    unsubscribePlayersStore = playersStore.subscribe(playersArray => {
      players = playersArray;
    });
    unsubscribeLoadingStore = loadingStore.subscribe(state => {
      loadingState = state;
    });
    focusTimeout = setTimeout(() => {
      inputForm.focus();
    }, 100);
  });

  onDestroy(() => {
    clearTimeout(focusTimeout);
    if (unsubscribePlayersStore) {
      unsubscribePlayersStore();
    }
    if (unsubscribeLoadingStore) {
      unsubscribeLoadingStore();
    }
  });
</script>

<div class="md:flex md:justify-between md:items-center">
  <form
    class="md:flex md:flex-wrap md:items-center"
    on:submit|preventDefault={() => dispatch('search', inputValue)}>
    <input
      bind:value={inputValue}
      bind:this={inputForm}
      type="text"
      id="player"
      name="player"
      placeholder="Player name / guid"
      class="border-solid border-blue-200 border-b-2 text-2xl
      focus:border-blue-700 outline-none w-full sm:w-96" />

    <Button
      type="submit"
      classNames="my-2 md:ml-2 flex flex-wrap justify-around items-center w-10"
      disabled={loadingState}>
      {#if loadingState}
        <!-- <Icon name="puff" classNames="fill-current text-white" /> -->
        <Loader
          borderTopColor="white"
          border="3px solid hsla(187, 69%, 97%, 0.74)"
          width="1.5em"
          height="1.5em" />
      {:else}
        <Icon name="search" classNames="" />
      {/if}
      <!-- <p>{`Search${loadingState ? 'ing' : ''}`}</p> -->
    </Button>
  </form>

  <p class="md:mr-2">Results: {players ? players.length : 0} </p>
</div>
