<script>
  import { createEventDispatcher } from "svelte";

  import {
    searchIcon,
    usersIcon,
    puffLoader,
    menuIcon,
    syncIcon,
    wifiIcon,
    starIcon,
    xIcon,
    alertIcon,
    infoIcon,
    loginIcon,
    logoutIcon,
    terminalIcon
  } from "./Icons";
  export let name;
  export let classNames = "";

  let icon = "";
  switch (name) {
    case "search":
      icon = searchIcon;
      break;
    case "users":
      icon = usersIcon;
      break;
    case "puff":
      icon = puffLoader;
      break;
    case "menu":
      icon = menuIcon;
      break;
    case "sync":
      icon = syncIcon;
      break;
    case "wifi":
      icon = wifiIcon;
      break;
    case "star":
      icon = starIcon;
      break;
    case "x":
      icon = xIcon;
      break;
    case "alert":
      icon = alertIcon;
      break;
    case "info":
      icon = infoIcon;
      break;
    case "login":
      icon = loginIcon;
      break;
    case "logout":
      icon = logoutIcon;
      break;
    case "terminal":
      icon = terminalIcon;
      break;
    default:
      break;
  }
  const dispatch = createEventDispatcher();
</script>

<style>

</style>

<span
  class={classNames}
  on:click={() => {
    dispatch('clicked');
  }}>
  {@html icon}
</span>
