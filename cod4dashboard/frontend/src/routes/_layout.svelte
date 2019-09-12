<script>
  import Cookies from "js-cookie";
  import { onMount, onDestroy } from "svelte";
  import { request } from "graphql-request";

  import {
    GetGraphQLClient,
    isLogged,
    login,
    logout,
    endpoint
  } from "../graphql/client";
  import Login from "../components/Login.svelte";
  import Icon from "../components/UI/Icon.svelte";
  import Loader from "../components/UI/Loader.svelte";
  import Nav from "../components/Nav.svelte";
  import loadingStore from "../stores/loading-store";
  import errorStore from "../stores/error-store";
  import { IS_LOGGED_QUERY } from "../graphql/queries";

  export let segment;
  let innerWidth = 480;
  let mounted = false;
  let logged = false;

  $: sideBarOpen = innerWidth >= 1024;
  $: mobile = innerWidth <= 360;

  onMount(() => {
    // GetGraphQLClient(Cookies.getJSON("token"))
    // new GraphQLClient(endpoint, {
    //   credentials: "include",
    //   headers: {
    //     authorization: Cookies.getJSON("token")
    //   },
    //   mode: "cors"
    // })
    //   .request(IS_LOGGED_QUERY)
    request(endpoint, IS_LOGGED_QUERY, { token: Cookies.getJSON("token") })
      .then(res => {
        logged = res.isLogged;
        mounted = true;
      })
      .catch(err => {
        mounted = true;
        logged = false;
      });
  });

  onDestroy(() => {
    mounted = false;
  });

  function handleLogin(e) {
    const password = e.detail;
    errorStore.resetError();
    if (password) {
      loadingStore.setLoading(true);
      login(password)
        .then(res => {
          logged = res.login;
          loadingStore.setLoading(false);
        })
        .catch(err => {
          errorStore.setError(err);
          logged = false;
          loadingStore.setLoading(false);
        });
    } else {
      errorStore.setError("password is a required field");
    }
  }

  const handleLogout = e => {
    logout()
      .then(res => {
        logged = !res.logout;
      })
      .catch(err => {
        logged = false;
      });
  };
</script>

<style>

</style>

<svelte:window bind:innerWidth />

{#if mounted}
  {#if logged}
    <Nav
      {segment}
      open={sideBarOpen}
      {mobile}
      on:clicked={() => {
        sideBarOpen = !sideBarOpen;
      }}
      on:logout={handleLogout} />

    <main class={`${sideBarOpen ? 'ml-56' : mobile ? 'ml-1' : 'ml-16'} p-4`}>
      {#if mobile}
        <Icon
          name="menu"
          classNames="mt-1 mb-4 menu-close inline-block cursor-pointer"
          on:clicked={() => {
            sideBarOpen = !sideBarOpen;
          }} />
      {/if}
      <slot />
    </main>
  {:else}
    <Login on:login={handleLogin} />
  {/if}
{:else}
  <div class="flex justify-center items-center h-screen w-screen">
    <Loader />
  </div>
{/if}
