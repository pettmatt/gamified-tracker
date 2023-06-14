<script lang="ts">
  import Hud from "./lib/Hud.svelte"
  import Map from "./lib/Map.svelte"
</script>

<main>
  <Map />
  <Hud />
</main>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>