import { writable } from "svelte/store"

export const sessionStartStatus = writable(false)
export const placeMarkersStatus = writable(false)
export const traveledDistance = writable(0)