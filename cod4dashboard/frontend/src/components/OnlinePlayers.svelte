<script>
  import { goto } from "@sapper/app";

  import Icon from "./UI/Icon.svelte";
  import Error from "./UI/Error.svelte";
  import PlayerBadge from "./UI/PlayerBadge.svelte";

  export let players = [];
</script>

<style>

</style>

<div class="table">
  <div class="row header">
    <div class="cell tracking-widest" />
    <div class="cell tracking-widest">num</div>
    <div class="cell tracking-widest">score</div>
    <div class="cell tracking-widest">ping</div>
    <div class="cell tracking-widest">playerid</div>
    <div class="cell tracking-widest">steamid</div>
    <div class="cell tracking-widest">name</div>
    <div class="cell tracking-widest">address</div>
  </div>
  <tbody>
    {#each players as player (player.playerID)}
      <div class="row">
        <div
          class="cell cursor-pointer align-middle"
          data-title=""
          on:click={() => {
            goto(`online/${player.playerGUID}`);
          }}>
          <Icon name="info" classNames="hover:color-4 align-middle" />
        </div>
        <div class="cell" data-title="pid">{player.pid}</div>
        <div class="cell" data-title="score">{player.score}</div>
        <div class="cell" data-title="ping">{player.ping}</div>
        <div class="cell" data-title="playerid">
           {player.playerGUID}
          <div class="inline-block mx-4">
            <PlayerBadge
              isAdmin={player.isAdmin}
              isVip={player.isVip}
              adminName={player.adminName}
              vipName={player.vipName} />
          </div>
        </div>
        <div class="cell" data-title="steamid">{player.steamid}</div>
        <div class="cell" data-title="name">{player.name}</div>
        <div class="cell" data-title="address">{player.playerIP}</div>
      </div>
    {/each}
  </tbody>
</div>

<!-- {#if !players || players.length <= 0}
  <Error
    errorMessage="Server is empty!"
    classNames="text-yellow-600 m-2 font-bold" />
{/if} -->
