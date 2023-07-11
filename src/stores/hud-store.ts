import { writable } from "svelte/store"
import { getItemFromLocalStorage } from "../services/localStorage-service"

export let sessionStartStatus = writable(false)
export let placeMarkersStatus = writable(false)
export let traveledDistance = writable(0)

export let settingsStatus = writable(false)
export let settings = writable({
    menus: {
        display: {
            fadeTopOnIdle: getItemFromLocalStorage("fadeTopOnIdle"),
            fadeRightOnIdle: getItemFromLocalStorage("fadeRightOnIdle"),
            fadeBottomOnIdle: getItemFromLocalStorage("fadeBottomOnIdle"),
        },
        functionality: {
            enableIdle: getItemFromLocalStorage("fadeBottomOnIdle"),
            idleTimer: getItemFromLocalStorage("idleTimer") || 10
        }
    },
    appFunctionality: {
        general: {
            offlineMode: getItemFromLocalStorage("offlineMode")
        },
        services: {
            allowThirdPartyServices: getItemFromLocalStorage("allowThirdPartyServices")
        }
    }
})