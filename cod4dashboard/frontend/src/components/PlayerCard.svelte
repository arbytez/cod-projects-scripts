<script>
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { distanceInWordsToNow, format } from "date-fns";

  import { formatDuration } from "../helpers/util";
  import PlayerBadge from "./UI/PlayerBadge.svelte";

  export let player;
  export let index = 0;
  let showAliases = false;

  const elementClassnames = "p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5";
  const aliases = player.aliases ? player.aliases.split(",") : [];
  const {
    playerGUID = "--",
    lastActivityDate = "--",
    onlineTime = "--",
    kills = "--",
    deaths = "--",
    headShots = "--",
    selfKills = "--",
    isVip = 0,
    isAdmin = 0,
    vipName = "",
    adminName = "",
    playerIP = "--",
    firstActivityIP = "--"
  } = player;
</script>

<style>

</style>

<div class={`${index % 2 ? 'background-2' : 'background-3'} rounded pb-2`}>
  <div class="flex content-between flex-wrap pb-2">
    <div class={elementClassnames}>
      <p class="font-bold">GUID</p>
      <p>{playerGUID}</p>
      <div class="mt-1">
        <PlayerBadge {isAdmin} {isVip} {adminName} {vipName} />
      </div>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">Last seen online</p>
      <p>
        {#if typeof lastActivityDate === 'number'}
          {format(new Date(lastActivityDate * 1000), 'DD/MM/YYYY HH:mm:ss')}
        {:else}--{/if}
      </p>
      <p>
        {#if typeof lastActivityDate === 'number'}
          {`${distanceInWordsToNow(new Date(lastActivityDate * 1000))} ago`}
        {/if}
      </p>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">Online time</p>
      {#if typeof lastActivityDate === 'number'}
        <p>{formatDuration(onlineTime * 1000)}</p>
      {:else}--{/if}
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">Kills</p>
      <p>{kills}</p>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">Deaths</p>
      <p>{deaths}</p>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">K/D Ratio</p>
      {#if deaths === 0 || deaths === '--' || kills === 0 || kills === '--'}
        <p>--</p>
      {:else}
        <p>{Math.round((kills / deaths) * 100) / 100}</p>
      {/if}
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">HeadShots</p>
      <p>{headShots}</p>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">SelfKills</p>
      <p>{selfKills}</p>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">First player IP</p>
      <p>{firstActivityIP}</p>
    </div>
    <div class={elementClassnames}>
      <p class="font-bold">Last player IP</p>
      <p>{playerIP}</p>
    </div>
  </div>
  <div class="flex flex-wrap justify-between items-center">
    <div class="ml-2">
      <p class="font-bold inline-block mr-2">First name</p>
      <p class="inline-block"> {aliases[0] || ''} </p>
    </div>
    <button
      type="button"
      class={`text-xs shadow rounded px-2 ml-2 mr-4
      focus:outline-none w-32 hover:text-gray-700 ${index % 2 ? 'background-3' : 'background-2'}`}
      on:click={() => {
        showAliases = !showAliases;
      }}>
       {!showAliases ? `Show all (${aliases.length}) aliases` : 'Hide aliases'}
    </button>
  </div>
  {#if showAliases}
    <div>
      <div class="flex flex-wrap justify-start pt-2">
        {#each aliases.sort((a, b) => a.length - b.length || a.localeCompare(b)) as alias, i}
          <p class="px-2">{alias}</p>
        {/each}
      </div>
    </div>
  {/if}
</div>
