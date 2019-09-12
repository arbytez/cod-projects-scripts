<script>
  import Icon from "./Icon.svelte";
  export let errorMessage;
  export let classNames = "";
</script>

<style>

</style>

{#if errorMessage}
  <div class={`${classNames}`}>
    <Icon name="alert" classNames="inline-block align-middle mr-1" />
    <p class="inline-block align-middle">{errorMessage}</p>
  </div>
{/if}
