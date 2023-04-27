<script lang="ts">
import icon from "../assets/svelte.svg"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"

export let valueArray: Array<boolean>
let map: any

let currentLocation: Array<number>
let waypointMarkers: Array<Array<number>> = []
let waypointCoordinates: Array<Array<number>> = []
let trackingCoordinates: Array<Array<number>> = []
let plannedPolyline: any = null
let trackingPolyline: any = null

const createMap = (container: any) => {
    let map = L.map(container).setView([51.505, -0.09], 13)
    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
            attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 20,
        }
    ).addTo(map)

    // const popup = L.popup()

    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }

    // map.on('click', onMapClick)

    // Put marker down on click
    const placeMarker = (e: any) => {
        const marker = L.marker()
        const coordinates = e.latlng
        marker.setLatLng(coordinates).addTo(map)

        waypointMarkers.push(marker) // Used to get easily access to the markers
        waypointCoordinates.push(coordinates) // Used to get easily the coordinates

        drawLine(waypointCoordinates, "plan")
        closeTheRoute(waypointCoordinates)
    }

    map.on("click", (true) && placeMarker)

    // Draw a line from marker to marker
    const drawLine = (coordinates: Array<Array<number>>, lineType: string = "plan" || "track") => {
        if (coordinates.length < 2) return

        // Reset polyline, so the previous values won't become a problem
        if (lineType === "plan")
            plannedPolyline = L.polyline(coordinates).addTo(map)
        else if (lineType === "track")
            trackingPolyline = L.polyline(coordinates).addTo(map)

        console.log("POLY", plannedPolyline)
        console.log("POLY 2", trackingPolyline)
    }

    const closeTheRoute = (coordinates: Array<Array<number>>) => {
        // Makes the route "loopable", bringing the user back to the starting point.
        if (coordinates.length > 2)
            plannedPolyline = L.polyline([ ...coordinates, coordinates[0] ]).addTo(map)
    }

    // Locate user
    map.locate({setView: true, maxZoom: 16})

    map.on("locationfound", (e: any) => {
        currentLocation = L.marker()

        // Locate and show user's location immediately
        locateUser(e)

        let trackingInterval = setInterval(() => {
            // Now update the location every 5 seconds
            locateUser(e)
        }, 5000)

        // Tracking can be stopped manually.
        // Going to be added later.
    })

    map.on("locationerror", (e: any) => {
        console.warn(e.message)
    })

    const locateUser = (e: any) => {
        const radius = e.accuracy

        // Ignore following error message "Property 'setLatLng' does not exist on type 'number[]'"
        // it's just the editor messing up.
        currentLocation.setLatLng(e.latlng).addTo(map)
            .bindPopup("Your location is within " + radius + " meters")

        trackingCoordinates.push(currentLocation.getLatLng())
        drawLine(trackingCoordinates, "track")
    }

    return map
}

const mapAction = (container: any) => {
    map = createMap(container)
    return {
        destroy: () => {
            map.remove
        }
    }
}

const resizeMap = () => {
    if (map) map.invalidateSize()
}

console.log(valueArray)
</script>

<svelte:window on:resize={resizeMap} />

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
</svelte:head>

<div id="leaf-map" style="width: 100%; height: 94%; background-color: #333;" use:mapAction />
