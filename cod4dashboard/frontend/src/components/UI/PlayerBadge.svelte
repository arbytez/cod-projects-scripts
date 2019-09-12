<script>
  export let isVip;
  export let isAdmin;
  export let vipName;
  export let adminName;
</script>

<style>
  .badge {
    font-size: 0.75rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    /* border: 1px solid var(--color-1); */
  }

  .label-badge {
    border-right: none;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }

  .player-badge {
    border-left: none;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  .label-vip-badge {
    background-color: #fcadad;
  }

  .label-admin-badge {
    background-color: #ddd38f;
  }

  .player-vip-badge {
    background-color: white;
  }

  .player-admin-badge {
    background-color: white;
  }
</style>

{#if isVip || isAdmin}
  <span class="flex justify-start items-center">
    <div
      class={`badge label-badge font-bold ${isVip ? 'label-vip-badge' : 'label-admin-badge'}`}>
       {isVip ? 'VIP' : 'ADMIN'}
    </div>
    <div
      class={`badge player-badge ${isVip ? 'player-vip-badge' : 'player-admin-badge'}`}>
       {isVip ? vipName : adminName}
    </div>
  </span>
{/if}
