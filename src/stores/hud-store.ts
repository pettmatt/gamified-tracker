import { writable } from "svelte/store"
import { onMount } from "svelte"

export let sessionStartStatus = writable(false)
export let placeMarkersStatus = writable(false)
export let traveledDistance = writable(0)