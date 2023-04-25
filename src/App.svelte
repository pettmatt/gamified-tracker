<script lang="ts">
import Map from "./lib/Map.svelte"
import Hud from "./lib/Hud.svelte"

let test1 = false
let test2 = false
let test3 = false
let test4 = false
let traveledDistance = 0
let started = false

</script>

<main>
  <Map valueArray={[test1, test2, test3, test4]} />
  <Hud valueArray={[test1, test2, test3, test4]} 
    traveledDistance={traveledDistance} sessionStarted={started} />
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