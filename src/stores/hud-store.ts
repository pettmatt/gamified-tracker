import { writable } from "svelte/store"
import { getItemFromLocalStorage } from "../services/localStorage-service"

// Booleans
export const settingUpSessionStatus = writable(false)
export const sessionStartStatus = writable(false)
export const placeMarkersStatus = writable(false)
export const highscoresStatus = writable(false)
export const historyStatus = writable(false)

// Numeric
export const traveledDistance = writable(0)

// Functions
export const removeMarkersFunction = writable(undefined)
export const createLoopFunction = writable(undefined)
export const createRouteFunction = writable(undefined)
export const removeLastMarker = writable(undefined)

// Settings
export const settingsStatus = writable(false)
export const settings = writable({
    menus: {
        display: {
            fadeTopOnIdle: getItemFromLocalStorage("fadeTopOnIdle"),
            fadeRightOnIdle: getItemFromLocalStorage("fadeRightOnIdle"),
            fadeBottomOnIdle: getItemFromLocalStorage("fadeBottomOnIdle"),
        },
        functionality: {
            enableIdle: getItemFromLocalStorage("fadeBottomOnIdle"),
            idconstimer: getItemFromLocalStorage("idconstimer") || 10
        }
    },
    appFunctionality: {
        general: {
            offlineMode: getItemFromLocalStorage("offlineMode"),
            units: { name: "metric", unit: "m"} || { name: "imperial", unit: ""}
        },
        services: {
            allowThirdPartyServices: getItemFromLocalStorage("allowThirdPartyServices")
        }
    }
})