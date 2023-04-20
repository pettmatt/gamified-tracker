<script lang="ts">
import icon from "../assets/svelte.svg"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import MarkerPopup from './MarkerPopup.svelte'
let map: any

const createMap = (container: any) => {
    let m = L.map(container).setView([51.505, -0.09], 13)
    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
            attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 14,
        }
    ).addTo(m)

    return m
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

</script>

<svelte:window on:resize={resizeMap} />

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
</svelte:head>

<div id="leaf-map" style="width: 100%; height: 100%; background-color: #333;" use:mapAction />
