<script lang="ts">
    import * as L from "leaflet"
    import "leaflet/dist/leaflet.css"
    import { createLoopFunction, createRouteFunction, sessionMarkers, placeMarkersStatus, plannedLength, removeLastMarker, removeMarkersFunction, routeLength, sessionStartStatus, traveledDistance } from "../stores/hud-store"
    import * as LeafletRouting from "../services/leaflet-routing-machine"
    import * as mapUtils from "../utils/mapUtils"
    import type { Waypoints, UserTracking, DistanceProvider } from "../interfaces/mapInterfaces"

    let map: any

    let generatedRoute: any = null
    let waypointDetails: Waypoints = {
        coordinates: [],
        markers: [],
        polyline: null
    }
    let userTracking: UserTracking = {
        currentLocation: [],
        coordinates: [],
        polyline: null
    }
    let totalDistances: DistanceProvider = {
        planned: {
            markerDistances: [],
            getSum: function() {
                return this.markerDistances
                    .reduce((sum: number, current: number) => sum + current)
            }
        },
        traveled: {
            markersPassed: [],
            sum: 0
        }
    }

    const createMap = (container: any) => {
        let map = L.map(container).setView([50.08804, 14.42076], 5)
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

            waypointDetails.coordinates.push(coordinates) // Used to get the coordinates easily
            waypointDetails.markers.push(marker) // Used to get easy access to the markers

            drawLine(waypointDetails.coordinates, "plan")

            let markerDistances = totalDistances.planned.markerDistances

            marker.setLatLng(coordinates, { draggable: true }).addTo(map)

            if (markerDistances.length < 1) {
                marker.bindPopup(`Starting point`)
            } else {
                const distance = markerDistances[markerDistances.length - 1]
                if (distance > 1000) {
                    marker.bindPopup(`Distance from the previous marker is 
                    ${ (distance / 1000).toFixed(2) } kilometers`)
                }
                else {
                    marker.bindPopup(`Distance from the previous marker is 
                    ${ (distance).toFixed(2) } meters`)
                }
            }

            map.addLayer(marker)
            sessionMarkers.set(waypointDetails)
        }

        map.on("click", ($event: any) => {
            if ($placeMarkersStatus) placeMarker($event)
        })

        const createLoop = (coordinates: Array<Array<number>>) => {
            // Makes the route "loopable", bringing the user back to the starting point.
            if (coordinates.length > 2) {
                waypointDetails.polyline = L.polyline([...coordinates, coordinates[0]]).addTo(map)
                // Pushing the first point again makes sure the routing plugin 
                // displays the route correctly as a loop.
                waypointDetails.coordinates.push(coordinates[0])
                calculateNewLineLength(waypointDetails.coordinates)
            }

        }

        createLoopFunction.set(() => createLoop(waypointDetails.coordinates))

        // Locate user
        let trackingInterval = null

        sessionStartStatus.subscribe(sessionStarted => {
            // Check if user has activated tracking through clicking on an element.
            if (sessionStarted) {
                if (!navigator.permissions) {
                    console.warn("The browser doesn't support geolocating the user.")
                    return
                }

                console.log("Starting geotracking")

                map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true })

                map.on("locationfound", (e: any) => {
                    userTracking.currentLocation = L.marker()

                    // Locate and show user's location immediately
                    trackUser(e)

                    trackingInterval = setInterval(() => {
                        // Now update the location every 2 seconds
                        trackUser(e)
                    }, 2000)
                })

                map.on("locationerror", (e: any) => {
                    console.warn(e.message)
                    clearTimeout(trackingInterval)
                    sessionStartStatus.set(false)
                })
            }

            else {
                clearTrackingHistory(map)
                clearMapMarkersAndPolylines(map)
                clearTimeout(trackingInterval)
                trackingInterval = null
                console.log("Cleaning and stopping geotracking")
            }
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

    // Draw a line from marker to marker
    const drawLine = (coordinates: Array<Array<number>>, lineType: string = "plan" || "track") => {
        if (coordinates.length < 2) return

        // Reset polyline, so the previous values won't become a problem
        if (lineType === "plan") {
            waypointDetails.polyline = L.polyline(coordinates).addTo(map)
            map.addLayer(waypointDetails.polyline)
            calculateNewLineLength(coordinates)
        }
        else if (lineType === "track") {
            // Possible fix to this is to get rid of if statement and to create polyline every time
            // if (trackingPolyline === null) {
            //     trackingPolyline = L.polyline(coordinates).addTo(map)
            //     map.addLayer(trackingPolyline)
            // }
            // else {
            //     // Creates "Uncaught TypeError: latlng is null" error
            //     trackingPolyline.addLatLng(coordinates)
            // }

            // This will be the fix to the issue pointed above, for now.
            userTracking.polyline = L.polyline(coordinates).addTo(map)
            map.addLayer(userTracking.polyline)

            mapUtils.calculateNewTraveledDistance(map, coordinates, totalDistances.traveled.sum)
        }
    }

    const trackUser = (e: any) => {
        // Sometimes the hook is unable to provide coordinates.
        if (e === null || e.latlng === undefined) {
            console.log("No coordinates found. Skipping this iteration.")
            return
        }

        const radius = e.accuracy

        // Ignore possible error created by "setLatLng" method. 
        // Typescript error which will be fixed later.
        userTracking.currentLocation.setLatLng(e.latlng).addTo(map)
            .bindPopup(`Your location is within ${ radius } meters`)

        userTracking.coordinates.push(userTracking.currentLocation.getLatLng())
        drawLine(userTracking.coordinates, "track")

        const newDistance = mapUtils.compareLocationWithNextMarker(waypointDetails, totalDistances, userTracking)
        totalDistances.traveled = newDistance
    }

    const calculateNewLineLength = (coordinates: Array<Array<number>>) => {
        const distance = map.distance(
            coordinates[totalDistances.planned.markerDistances.length],
            coordinates[coordinates.length - 1]
        )

        totalDistances.planned.markerDistances.push(distance)
        // Update the store values so the HUD can show the planned distance
        plannedLength.set(totalDistances.planned.getSum())
    }

    const clearTrackingHistory = (map: any) => {
        map.removeLayer(userTracking.currentLocation)
        map.removeLayer(userTracking.coordinates)

        userTracking.currentLocation = []
        userTracking.coordinates = []
    }

    const clearMapMarkersAndPolylines = (map: any) => {
        map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                map.removeLayer(layer)
            }
        })

        waypointDetails = {
            coordinates: [],
            markers: [],
            polyline: null
        }

        totalDistances.planned.markerDistances = []

        plannedLength.set(0)
        routeLength.set(0)
    }

    const showPlanningMarkers = () => {

    }

    const hidePlanningMarkers = () => {

    }

    const createLeafletRouting = () => {
        // At this time I'm unable to calculate the distance of the route which is provided by the routing plugin
        const route = LeafletRouting.createRoute(L, map, generatedRoute, waypointDetails.coordinates)
        // console.log(route.getRouter())
        // routeLength.set(calculateDistanceOfRoute(route))
    }

    const checkLayers = () => {
        let markercount = 0
        let polylineCount = 0
        map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                markercount++
            } else if (layer instanceof L.Polyline) {
                polylineCount++
            }
        })

        console.log("Markers:", markercount)
        console.log("Polylines:", polylineCount)
    }

    // Pass functions that need map parameters to hud-store.
    // When necessary the function is passed else where in this file.
    removeMarkersFunction.set(() => clearMapMarkersAndPolylines(map))
    createRouteFunction.set(() => createLeafletRouting())
</script>

<svelte:window on:resize={resizeMap} />

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
</svelte:head>

<div id="leaf-map" style="height: 100%; background-color: #333;" use:mapAction />