<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  import loadingStore from "../stores/loading-store";
  import errorStore from "../stores/error-store";
  import Loader from "./UI/Loader.svelte";
  import Error from "./UI/Error.svelte";
  import Icon from "./UI/Icon.svelte";

  let unsubscribeLoadingStore;
  let loadingState;
  let inputForm;
  let focusTimeout;

  const dispatch = createEventDispatcher();

  onMount(() => {
    errorStore.resetError();
    unsubscribeLoadingStore = loadingStore.subscribe(state => {
      loadingState = state;
    });
    focusTimeout = setTimeout(() => {
      inputForm.focus();
    }, 100);
  });

  onDestroy(() => {
    errorStore.resetError();
    clearTimeout(focusTimeout);
    if (unsubscribeLoadingStore) {
      unsubscribeLoadingStore();
    }
  });
</script>

<style>
  form {
    height: 60vh;
  }
  input {
    top: 10rem;
  }
  button {
    top: 15rem;
  }
  .error {
    top: 20rem;
  }
</style>

<div class="h-screen w-screen text-2xl">
  <form
    class="w-full flex flex-col justify-center items-center relative"
    on:submit|preventDefault={() => dispatch('login', inputForm.value)}
    disabled={loadingState}>
    <input
      type="password"
      id="password"
      placeholder="Password"
      bind:this={inputForm}
      class="p-4 my-2 rounded background-3 focus:background-5 outline-none w-5/6
      sm:w-3/5 lg:w-1/3 xl:w-1/4 absolute" />
    <button
      type="submit"
      disabled={loadingState}
      class="p-4 my-2 font-bold tracking-widest text-white outline-none
      active:outline-none focus:outline-none hover:color-1 rounded shadow
      background-1 hover:background-2 w-5/6 sm:w-3/5 lg:w-1/3 xl:w-1/4 flex
      justify-center items-center absolute">
      {#if loadingState}
        <Loader
          borderTopColor="white"
          border="3px solid hsla(187, 69%, 97%, 0.74)"
          width="1.3em"
          height="1.3em" />
      {:else}
        <Icon name="login" />
      {/if}
      <p class="ml-4">{`Login${loadingState ? '...' : ''}`}</p>
    </button>

    {#each $errorStore as errorMessage}
      <div class="error absolute">
        <Error {errorMessage} classNames="text-red-600 m-2 font-bold" />
      </div>
    {/each}
  </form>
</div>
