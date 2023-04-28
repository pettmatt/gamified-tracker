<script lang="ts">
  import Map from "./lib/Map.svelte"
  import Hud from "./lib/Hud.svelte"
</script>

<main>
  <Map />
  <Hud />
</main>

<style>
  main {
    width: 100svw;
    height: 100svh;
  }
</style>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>