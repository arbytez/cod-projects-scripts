<script>
  import { createEventDispatcher } from "svelte";

  import Icon from "./UI/Icon.svelte";

  export let segment;
  export let open = true;
  export let mobile = false;

  const activeRoute = `text-white side-bar-border font-bold tracking-wider`;
  const notActiveRoute = `side-bar-element tracking-wider`;
  const activeIcon = `text-white -ml-1`;
  const notActiveIcon = `side-bar-element tracking-wider`;

  const dispatch = createEventDispatcher();
</script>

<style>
  li {
    padding: 1.2rem 0 1.2rem 1.2rem;
  }
  .side-bar-element {
    color: var(--color-2);
    font-weight: 700;
  }
  .side-bar-border {
    border-left: 4px var(--color-3) solid;
  }
  .side-bar-element:hover {
    color: var(--color-4);
  }
</style>

<ul
  class={`background-1 rounded fixed h-screen z-10 ${open ? 'w-56' : mobile ? 'w-1' : 'w-16'} `}>

  <li
    class={`flex flex-row-reverse cursor-pointer ${open ? 'justify-start' : 'justify-center'} items-center px-1 ${notActiveIcon}`}
    on:click={() => {
      dispatch('clicked');
    }}>
    {#if !mobile}
      {#if open}
        <Icon name="x" classNames={`mr-4 ${notActiveIcon}`} />
      {:else}
        <Icon name="menu" classNames={`mr-5 ${notActiveIcon}`} />
      {/if}
    {:else if open}
      <Icon name="x" classNames={`mr-4 ${notActiveIcon}`} />
    {/if}
  </li>
  <a href="/">
    <li class={`${!segment ? activeRoute : notActiveRoute}`}>
      <div class="flex items-center">
        {#if !mobile || open}
          <Icon
            name="users"
            classNames={`${!segment ? activeIcon : notActiveIcon}`} />
        {/if}
        {#if open}
          <p class="ml-4">Players</p>
        {/if}
      </div>
    </li>
  </a>
  <a href="/online">
    <li class={`${segment === 'online' ? activeRoute : notActiveRoute}`}>
      <div class="flex items-center">
        {#if !mobile || open}
          <Icon
            name="wifi"
            classNames={`${segment === 'online' ? activeIcon : notActiveIcon}`} />
        {/if}
        {#if open}
          <p class="ml-4">Online Players</p>
        {/if}
      </div>
    </li>
  </a>
  <a href="/adminsvips">
    <li class={`${segment === 'adminsvips' ? activeRoute : notActiveRoute}`}>
      <div class="flex items-center">
        {#if !mobile || open}
          <Icon
            name="star"
            classNames={`${segment === 'adminsvips' ? activeIcon : notActiveIcon}`} />
        {/if}
        {#if open}
          <p class="ml-4">Admins and Vips</p>
        {/if}
      </div>
    </li>
  </a>
  <a href="/console">
    <li class={`${segment === 'console' ? activeRoute : notActiveRoute}`}>
      <div class="flex items-center">
        {#if !mobile || open}
          <Icon
            name="terminal"
            classNames={`${segment === 'console' ? activeIcon : notActiveIcon}`} />
        {/if}
        {#if open}
          <p class="ml-4">Console</p>
        {/if}
      </div>
    </li>
  </a>
  <li
    class={`cursor-pointer absolute bottom-0 w-full ${notActiveRoute}`}
    on:click={() => {
      dispatch('logout');
    }}>
    <div class="flex items-center">
      {#if !mobile || open}
        <Icon name="logout" classNames={`${notActiveIcon}`} />
      {/if}
      {#if open}
        <p class="ml-4">Logout</p>
      {/if}
    </div>
  </li>
</ul>
