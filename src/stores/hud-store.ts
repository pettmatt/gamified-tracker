import { writable } from "svelte/store"
import { getItemFromLocalStorage } from "../services/localStorage-service"

export let sessionStartStatus = writable(false)
export let placeMarkersStatus = writable(false)
export let traveledDistance = writable(0)

export let settingsStatus = writable(true)
export let settings = writable({
    menus: {
        display: {
            fadeTopOnIdle: getItemFromLocalStorage("fadeTopOnIdle") || true,
            fadeRightOnIdle: getItemFromLocalStorage("fadeRightOnIdle") || true,
            fadeBottomOnIdle: getItemFromLocalStorage("fadeBottomOnIdle") || true,
        },
        functionality: {
            enableIdle: getItemFromLocalStorage("fadeBottomOnIdle") || true,
            idleTimer: getItemFromLocalStorage("idleTimer") || 10
        }
    },
    appFunctionality: {
        general: {
            offlineMode: getItemFromLocalStorage("offlineMode") || false
        },
        services: {
            allowThirdPartyServices: getItemFromLocalStorage("allowThirdPartyServices") || true
        }
    }
})