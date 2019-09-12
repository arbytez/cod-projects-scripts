<script>
  import { onMount, onDestroy } from "svelte";

  import loadingStore from "../stores/loading-store";
  import { adminsAndVips } from "../graphql/client";
  import PlayerCard from "../components/PlayerCard.svelte";
  import errorStore from "../stores/error-store";
  import Error from "../components/UI/Error.svelte";
  import Loader from "../components/UI/Loader.svelte";

  let unsubscribeLoadingStore;
  let loadingState;
  let adminPlayers = [];
  let vipPlayers = [];

  onMount(() => {
    errorStore.resetError();
    unsubscribeLoadingStore = loadingStore.subscribe(state => {
      loadingState = state;
    });
    loadingStore.setLoading(true);
    errorStore.resetError();
    adminsAndVips()
      .then(result => {
        loadingStore.setLoading(false);
        adminPlayers = result.admins;
        vipPlayers = result.vips;
      })
      .catch(err => {
        errorStore.setError(err);
        loadingStore.setLoading(false);
        adminPlayers = [];
        vipPlayers = [];
      });
  });

  onDestroy(() => {
    errorStore.resetError();
    if (unsubscribeLoadingStore) {
      unsubscribeLoadingStore();
    }
  });

  function countPl(players, playerType) {
    return [
      ...new Set(
        players.map(player => {
          return playerType === "vip"
            ? player.vipName
            : playerType === "admin"
            ? player.adminName
            : "";
        })
      )
    ].length;
  }
</script>

<style>
  .admin-background {
    background: #ddd38f;
    border-radius: 2rem;
    padding: 2rem;
  }

  .vip-background {
    background: #fcadad;
    border-radius: 2rem;
    padding: 2rem;
  }
</style>

<svelte:head>
  <title>Admin and Vips</title>
</svelte:head>

<h1 class="text-3xl font-bold">ADMIN & VIPS</h1>

<div class="mt-4 admin-background">
  <h2 class="mb-2">ADMINS ({countPl(adminPlayers, 'admin')})</h2>
  {#each adminPlayers as admin, index (admin.playerGUID)}
    <div class="my-4">
      <PlayerCard player={admin} {index} />
    </div>
  {:else}
    {#if loadingState}
      <Loader />
    {:else}
      <p>No admins found!</p>
    {/if}
    {#each $errorStore as errorMessage}
      <Error {errorMessage} classNames="text-red-600 m-2 font-bold" />
    {/each}
  {/each}
</div>

<div class="mt-5 vip-background">
  <h2 class="mb-2">VIPS ({countPl(vipPlayers, 'vip')})</h2>
  {#each vipPlayers as vip, index (vip.playerGUID)}
    <div class="my-4">
      <PlayerCard player={vip} {index} />
    </div>
  {:else}
    {#if loadingState}
      <Loader />
    {:else}
      <p>No vips found!</p>
    {/if}
    {#each $errorStore as errorMessage}
      <Error {errorMessage} classNames="text-red-600 m-2 font-bold" />
    {/each}
  {/each}
</div>
