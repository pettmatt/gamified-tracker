import { writable } from "svelte/store"

export let sessionStartStatus = writable(false)
export let placeMarkersStatus = writable(false)
export let settingsStatus = writable(true)
export let traveledDistance = writable(0)