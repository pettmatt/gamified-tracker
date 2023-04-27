<script lang="ts">
import icon from "../assets/svelte.svg"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"

export let valueArray: Array<boolean>
let map: any

let currentLocation: Array<number>
let waypointMarkers: Array<Array<number>> = []
let waypointCoordinates: Array<Array<number>> = []
let polyline: any = null

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

        drawLine(waypointCoordinates)
    }

    map.on("click", (true) && placeMarker)

    // Draw a line from marker to marker
    const drawLine = (coordinates: Array<Array<number>>) => {
        if (coordinates.length < 2) return

        polyline = L.polyline(coordinates).addTo(map)

        if (coordinates.length > 2)
            closeTheRoute(coordinates)
    }

    const closeTheRoute = (coordinates: Array<Array<number>>) => {
        // Makes the route "loopable", bringing the user back to the starting point.
        polyline = L.polyline([ ...coordinates, coordinates[0] ]).addTo(map)
    }

    // Locate user
    map.locate({setView: true, maxZoom: 16})
    map.on("locationfound", (e: any) => {
        const radius = e.accuracy

        L.marker(e.latlng).addTo(map)
            .bindPopup("Your location is within " + radius + " meters")
            .openPopup()
    })
    map.on("locationerror", (e) => {
        console.warn(e.message)
    })

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
