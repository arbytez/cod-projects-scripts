<script>
  import { onMount, onDestroy } from "svelte";

  import { searchPlayers } from "../graphql/client";
  import Error from "../components/UI/Error.svelte";
  import playersStore from "../stores/players-store";
  import errorStore from "../stores/error-store";
  import loadingStore from "../stores/loading-store";
  import SearchPlayerForm from "../components/SearchPlayerForm.svelte";
  import PlayerCard from "../components/PlayerCard.svelte";
  import Login from "../components/Login.svelte";

  function handleSearch(e) {
    if (e.detail) {
      loadingStore.setLoading(true);
      errorStore.resetError();
      searchPlayers(e.detail)
        .then(result => {
          playersStore.setPlayers(result.searchPlayers);
          loadingStore.setLoading(false);
        })
        .catch(err => {
          errorStore.setError(err);
          playersStore.setPlayers([]);
          loadingStore.setLoading(false);
        });
    }
  }

  onMount(() => {
    errorStore.resetError();
  });

  onDestroy(() => {
    errorStore.resetError();
  });
</script>

<style>

</style>

<svelte:head>
  <title>Players</title>
</svelte:head>

<h1 class="text-3xl font-bold">PLAYERS</h1>

<div class="mt-4">
  <SearchPlayerForm on:search={handleSearch} />
</div>

<ul class="mt-2">
  {#each $playersStore as player, index (player.playerID)}
    <li class="my-2">
      <PlayerCard {player} {index} />
    </li>
  {:else}
    {#each $errorStore as errorMessage}
      <Error {errorMessage} classNames="text-red-600 m-2 font-bold" />
    {/each}
  {/each}
</ul>
