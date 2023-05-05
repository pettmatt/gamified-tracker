<script lang="ts">
    import icon from "../assets/svelte.svg"
    import * as L from "leaflet"
    import "leaflet/dist/leaflet.css"
    import { placeMarkersStatus, sessionStartStatus } from "../stores/hud-store"

    let map: any

    interface DistanceProvider {
        planned: {
            markerDistances: Array<number>
            getSum: Function
        },
        traveled: {
            sum: number
        },
    }

    let currentLocation: Array<number> = []
    let waypointMarkers: Array<Array<number>> = []
    let waypointCoordinates: Array<Array<number>> = []
    let trackingCoordinates: Array<Array<number>> = []
    let plannedPolyline: any = null
    let trackingPolyline: any = null
    let totalDistances: DistanceProvider = {
        planned: {
            markerDistances: [],
            getSum: function() {
                return this.markerDistances
                    .reduce((sum: number, current: number) => sum + current)
            }
        },
        traveled: {
            sum: 0
        }
    }

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

        // Put marker down on click
        const placeMarker = (e: any) => {
            const marker = L.marker()
            const coordinates = e.latlng
            marker.setLatLng(coordinates, { draggable: true }).addTo(map)
            map.addLayer(marker)
        
            waypointMarkers.push(marker) // Used to get easy access to the markers
            waypointCoordinates.push(coordinates) // Used to get easily the coordinates

            drawLine(waypointCoordinates, "plan")
            // closeTheRoute(waypointCoordinates)
        }

        map.on("click", ($event: any) => {
            if ($placeMarkersStatus) placeMarker($event)
        })

        // Draw a line from marker to marker
        const drawLine = (coordinates: Array<Array<number>>, lineType: string = "plan" || "track") => {
            if (coordinates.length < 2) return

            // Reset polyline, so the previous values won't become a problem
            if (lineType === "plan") {
                plannedPolyline = L.polyline(coordinates).addTo(map)
                map.addLayer(plannedPolyline)
                calculateNewMarkerDistance(coordinates)
            }
            else if (lineType === "track") {
                trackingPolyline = L.polyline(coordinates).addTo(map)
                map.addLayer(trackingPolyline)
                calculateNewTraveledDistance(coordinates)
            }
        }

        const calculateNewMarkerDistance = (coordinates: Array<Array<number>>) => {
            const distance = map.distance(
                coordinates[totalDistances.planned.markerDistances.length],
                coordinates[coordinates.length - 1]
            )

            totalDistances.planned.markerDistances.push(distance)
        }

        const calculateNewTraveledDistance = (coordinates: Array<Array<number>>) => {
            const distance = map.distance(coordinates[0], coordinates[coordinates.length-1])
            totalDistances.traveled.sum += distance
        }

        const closeTheRoute = (coordinates: Array<Array<number>>) => {
            // Makes the route "loopable", bringing the user back to the starting point.
            if (coordinates.length > 2)
                plannedPolyline = L.polyline([...coordinates, coordinates[0]]).addTo(map)
        }

        // Locate user
        let trackingInterval = null

        sessionStartStatus.subscribe(trackingValue => {
            if (trackingValue) {
                map.locate({setView: true, maxZoom: 16})

                map.on("locationfound", (e: any) => {
                    currentLocation = L.marker()

                    // Locate and show user's location immediately
                    locateUser(e)

                    trackingInterval = setInterval(() => {
                        // Now update the location every 5 seconds
                        locateUser(e)
                    }, 5000)
                })

                map.on("locationerror", (e: any) => {
                    console.warn(e.message)
                    clearTimeout(trackingInterval)
                    sessionStartStatus.set(false)
                })
            }

            else {
                clearTrackingHistory(map)
                clearTimeout(trackingInterval)
                trackingInterval = null
            }
        })

        const locateUser = (e: any) => {
            const radius = e.accuracy

            // Ignore possible error created by "setLatLng" method. 
            // Typescript error which will be fixed later.
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

    const clearTrackingHistory = (map: any) => {
        map.removeLayer(currentLocation)
        map.removeLayer(trackingCoordinates)

        currentLocation = []
        trackingCoordinates = []
    }
</script>

<svelte:window on:resize={resizeMap} />

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
</svelte:head>

<div id="leaf-map" style="width: 100%; height: 100%; background-color: #333;" use:mapAction />
