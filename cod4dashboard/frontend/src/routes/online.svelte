<script>
  import { onMount, onDestroy } from "svelte";

  import Button from "../components/UI/Button.svelte";
  import Icon from "../components/UI/Icon.svelte";
  import Loader from "../components/UI/Loader.svelte";
  import { serverStatus } from "../graphql/client";
  import onlinePlayersStore from "../stores/onlinePlayers-store";
  import loadingStore from "../stores/loading-store";
  import OnlinePlayers from "../components/OnlinePlayers.svelte";
  import errorStore from "../stores/error-store";
  import Error from "../components/UI/Error.svelte";

  let unsubscribeOnlinePlayersStore;
  let unsubscribeLoadingStore;
  let players;
  let loadingState;
  const flexboxClasses = `w-full xs:flex-wrap xs:flex xs:justify-between xs:items-center`;
  let serverStatusData = {
    online: false,
    hostname: "",
    version: "",
    os: "",
    type: "",
    map: "",
    onlinePlayers: []
  };

  onMount(() => {
    errorStore.resetError();
    unsubscribeOnlinePlayersStore = onlinePlayersStore.subscribe(
      playersArray => {
        players = playersArray;
      }
    );
    unsubscribeLoadingStore = loadingStore.subscribe(state => {
      loadingState = state;
    });
    // handleRefresh();
  });

  onDestroy(() => {
    errorStore.resetError();
    if (unsubscribeOnlinePlayersStore) {
      unsubscribeOnlinePlayersStore();
    }
    if (unsubscribeLoadingStore) {
      unsubscribeLoadingStore();
    }
  });

  function handleRefresh() {
    loadingStore.setLoading(true);
    errorStore.resetError();
    serverStatus()
      .then(res => {
        serverStatusData = { ...res.serverStatus };
        onlinePlayersStore.setOnlinePlayers(serverStatusData.onlinePlayers);
        loadingStore.setLoading(false);
      })
      .catch(err => {
        errorStore.setError(err);
        onlinePlayersStore.setOnlinePlayers([]);
        loadingStore.setLoading(false);
      });
  }
</script>

<style>

</style>

<svelte:head>
  <title>Online Players</title>
</svelte:head>

<h1 class="text-3xl font-bold">ONLINE PLAYERS</h1>

<div class="mt-4 p-4 background-3 rounded">
  <div class="flex justify-between items-center">
    <div class="text-xl font-bold pb-2">Server Info</div>
    <Button
      type="button"
      classNames="flex justify-center items-center mr-1"
      disabled={loadingState}
      on:clicked={handleRefresh}>
      {#if loadingState}
        <Loader
          borderTopColor="white"
          border="3px solid hsla(187, 69%, 97%, 0.74)"
          width="1rem"
          height="1rem" />
      {:else}
        <Icon name="sync" classNames="h-4 w-4" />
      {/if}
    </Button>
  </div>
  <div class={flexboxClasses}>
    <div class="w-full sm:w-1/2">
      <div class={flexboxClasses}>
        <div class="font-bold">Ip:</div>
        <div class="mr-5">{process.env.COD4_SERVER_IP || ''}</div>
      </div>
      <div class={flexboxClasses}>
        <div class="font-bold">Port:</div>
        <div class="mr-5">{process.env.COD4_SERVER_PORT || ''}</div>
      </div>
      <div class={flexboxClasses}>
        <div class="font-bold">Hostname:</div>
        <div class="mr-5">{serverStatusData.hostname}</div>
      </div>
      <div class={flexboxClasses}>
        <div class="font-bold">Version:</div>
        <div class="mr-5">{serverStatusData.version}</div>
      </div>
    </div>
    <div class="w-full sm:w-1/2">
      <div class={flexboxClasses}>
        <div class="font-bold">OS:</div>
        <div class="mr-5">{serverStatusData.os}</div>
      </div>
      <div class={flexboxClasses}>
        <div class="font-bold">Type:</div>
        <div class="mr-5">{serverStatusData.type}</div>
      </div>
      <div class={flexboxClasses}>
        <div class="font-bold">Map:</div>
        <div class="mr-5">{serverStatusData.map}</div>
      </div>
      <div class={flexboxClasses}>
        <div class="font-bold">Players:</div>
        <div class="mr-5">
           {serverStatusData.onlinePlayers.length}/{process.env.COD4_SERVER_MAX_SLOTS || ''}

        </div>
      </div>
    </div>
  </div>
</div>

<div class="mt-4">
  <OnlinePlayers {players} />
</div>

{#each $errorStore as errorMessage}
  <Error {errorMessage} classNames="text-red-600 m-2 font-bold" />
{/each}
