<script>
  export let borderTopColor = "black";
  export let border = "3px solid hsla(189, 4%, 35%, 0.2)";
  export let width = "3em";
  export let height = "3em";
</script>

<style>
  div {
    border: 3px solid hsla(187, 69%, 97%, 0.74);
    border-top-color: #3cefff;
    border-radius: 50%;
    width: 3em;
    height: 3em;
    animation: spin 1s linear infinite;
    z-index: 10;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

<div
  style={`border: ${border};
            border-top-color: ${borderTopColor};
            width: ${width};
            height: ${height};
            `} />
