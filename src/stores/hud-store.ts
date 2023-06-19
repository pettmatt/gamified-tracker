import { writable } from "svelte/store"
import { onMount } from "svelte"

export let sessionStartStatus = writable(false)
export let placeMarkersStatus = writable(false)
export let traveledDistance = writable(0)

// When component is mounted to the DOM initial starting values.
// Useful while developing, hot refreshing doesn't keep old values.
onMount(() => {
    sessionStartStatus = writable(false)
    placeMarkersStatus = writable(false)
    traveledDistance = writable(0)
})