<script>
  import { createEventDispatcher } from "svelte";

  export let type = "button";
  export let classNames = "";
  export let disabled = false;
  export let style = "";

  const dispatch = createEventDispatcher();
</script>

<style>
  button {
    background: var(--color-1);
  }
  button:hover {
    background: var(--color-4);
  }
</style>

<button
  {type}
  class={`text-white rounded shadow px-2 py-1 focus:outline-none ${classNames}`}
  {style}
  {disabled}
  on:click={() => dispatch('clicked')}>
  <slot />
</button>
