<script context="module">
  export async function preload(page, session) {
    return { guid: page.params.guid };
  }
</script>

<script>
  import { goto } from "@sapper/app";
  import { onMount, onDestroy } from "svelte";

  import PlayerCard from "../../components/PlayerCard.svelte";
  import onlinePlayersStore from "../../stores/onlinePlayers-store";

  export let guid;

  let unsubscribeOnlinePlayersStore;
  let player = {};
  let canShowPage = false;

  onMount(() => {
    unsubscribeOnlinePlayersStore = onlinePlayersStore.subscribe(
      playersArray => {
        const playerIndex = playersArray.findIndex(i => i.playerGUID === guid);
        if (playerIndex >= 0) {
          player = playersArray[playerIndex];
          canShowPage = true;
        } else {
          goto("online");
        }
      }
    );
  });

  onDestroy(() => {
    if (unsubscribeOnlinePlayersStore) {
      unsubscribeOnlinePlayersStore();
    }
  });
</script>

<style>

</style>

<svelte:head>
  <title>Player Profile</title>
</svelte:head>

{#if canShowPage}
  <h1 class="text-3xl font-bold">PLAYER PROFILE</h1>

  <div class="mt-4">
    <span class="border-b-2 border-black hover:border-gray-500">
      <a href="online" class="mb-2">Back to online players</a>
    </span>
  </div>

  <div class="mt-4">
    <PlayerCard {player} />
  </div>
{/if}
