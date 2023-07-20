import { writable } from "svelte/store"
import { getItemFromLocalStorage } from "../services/localStorage-service"

// Booleans
export const settingUpSessionStatus = writable<Boolean>(false)
export const sessionStartStatus = writable<Boolean>(false)
export const placeMarkersStatus = writable<Boolean>(false)
export const highscoresStatus = writable<Boolean>(false)
export const historyStatus = writable<Boolean>(false)

// Numeric
export const traveledDistance = writable<Number>(0)
export const plannedLength = writable<Number>(0)
export const routeLength = writable<Number>(0)

// Functions
export const removeMarkersFunction = writable<Function>(undefined)
export const createRouteFunction = writable<Function>(undefined)
export const createLoopFunction = writable<Function>(undefined)
export const removeLastMarker = writable<Function>(undefined)
export const getMapStatistics = writable<Function>(undefined)

// User session settings
// These values are meant to be stored and displayed in History / Highscore menu
export const sessionMarkers = writable(undefined)
export const sessionDetails = writable({
    category: undefined,
    goal: {
        markers: undefined,
        estimatedDistance: undefined,
        lengthSpecified: false,
        distance: undefined,
        time: undefined,
    },
    session: {
        routeCoordinates: undefined,
        markerCount: undefined,
        passedThroughMarkers: undefined,
        distance: undefined,
        startingTime: undefined,
        endTimer: undefined
    }
})

// Settings
export const settingsStatus = writable<Boolean>(false)
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