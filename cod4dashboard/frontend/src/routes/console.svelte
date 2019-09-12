<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import Button from "../components/UI/Button.svelte";
  import loadingStore from "../stores/loading-store";
  import Icon from "../components/UI/Icon.svelte";
  import Loader from "../components/UI/Loader.svelte";
  import { sendRconCommand, commandResponses } from "../graphql/client";
  import errorStore from "../stores/error-store";
  import Error from "../components/UI/Error.svelte";

  let inputForm;
  let unsubscribeLoadingStore;
  let loadingState;
  let focusTimeout;
  let rconResponse = "";

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

  function handleSubmit(e) {
    if (inputForm.value) {
      errorStore.resetError();
      loadingStore.setLoading(true);
      sendRconCommand(inputForm.value)
        .then(res => {
          rconResponse = res.sendRconCommand;
          loadingStore.setLoading(false);
        })
        .catch(err => {
          rconResponse = "";
          errorStore.setError(err);
          loadingStore.setLoading(false);
        });
    }
  }
</script>

<style>

</style>

<svelte:head>
  <title>Console</title>
</svelte:head>

<h1 class="text-3xl font-bold">Console</h1>

<div class="md:flex md:justify-between md:items-center">
  <div class="mt-4">
    <form
      on:submit|preventDefault={handleSubmit}
      class="md:flex md:flex-wrap md:items-center">
      <input
        type="text"
        name="command"
        id="command"
        placeholder="Command"
        bind:this={inputForm}
        class="border-solid border-blue-200 border-b-2 text-2xl
        focus:border-blue-700 outline-none w-full sm:w-96" />
      <Button
        type="submit"
        classNames="my-2 md:ml-2 flex flex-wrap justify-around items-center w-10"
        disabled={loadingState}>
        {#if loadingState}
          <!-- <Icon name="puff" classNames="fill-current text-white" /> -->
          <Loader
            borderTopColor="white"
            border="3px solid hsla(187, 69%, 97%, 0.74)"
            width="1.5em"
            height="1.5em" />
        {:else}
          <Icon name="terminal" classNames="" />
        {/if}
        <!-- <p>{`Search${loadingState ? 'ing' : ''}`}</p> -->
      </Button>
    </form>
  </div>
</div>

<h3 class="text-xl my-4">Command response</h3>

<pre
  class="p-4 background-3 w-full text-xs h-180 block rounded shadow
  overflow-x-auto overflow-y-auto">
  {#if loadingState}
    <Loader
      borderTopColor="white"
      border="3px solid hsla(187, 69%, 97%, 0.74)"
      width="3em"
      height="3em" />
  {:else}{rconResponse}{/if}
  {#each $errorStore as errorMessage}
    <Error {errorMessage} classNames="text-red-600 m-2 font-bold" />
  {/each}
</pre>
