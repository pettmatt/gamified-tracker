<script lang="ts">
    import * as L from "leaflet"
    import "leaflet/dist/leaflet.css"
    import { createLoopFunction, createRouteFunction, placeMarkersStatus, plannedLength, removeLastMarker, removeMarkersFunction, routeLength, sessionStartStatus, traveledDistance } from "../stores/hud-store"
    import * as LeafletRouting from "../services/leaflet-routing-machine"

    let map: any

    interface DistanceProvider {
        planned: {
            markerDistances: Array<number>
            getSum: Function
        }
        traveled: {
            markersPassed: Array<object>
            sum: number
        }
    }
    interface Waypoints {
        coordinates: Array<Array<number>>
        markers: Array<Array<number>>
        polyline: any
    }
    interface UserTracking {
        currentLocation: Array<number>
        coordinates: Array<Array<number>>
        polyline: any
    }

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

                // Update the store values so the HUD can show the planned distance
                plannedLength.set(totalDistances.planned.getSum())
            }

            map.addLayer(marker)
        }

        map.on("click", ($event: any) => {
            if ($placeMarkersStatus) placeMarker($event)
        })

        // Draw a line from marker to marker
        const drawLine = (coordinates: Array<Array<number>>, lineType: string = "plan" || "track") => {
            if (coordinates.length < 2) return

            // Reset polyline, so the previous values won't become a problem
            if (lineType === "plan") {
                waypointDetails.polyline = L.polyline(coordinates).addTo(map)
                map.addLayer(waypointDetails.polyline)
                calculateNewMarkerDistance(coordinates)
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
            // Update the travel distance
            traveledDistance.update(value => totalDistances.traveled.sum)
        }

        const createLoop = (coordinates: Array<Array<number>>) => {
            // Makes the route "loopable", bringing the user back to the starting point.
            if (coordinates.length > 2) {
                waypointDetails.polyline = L.polyline([...coordinates, coordinates[0]]).addTo(map)
                // Pushing the first point again makes sure the routing plugin 
                // displays the route correctly as a loop.
                waypointDetails.coordinates.push(coordinates[0])
            }
        }

        createLoopFunction.set(() => createLoop(waypointDetails.coordinates))

        // Locate user
        let trackingInterval = null

        sessionStartStatus.subscribe(trackingValue => {
            // Check if user has activated tracking through clicking on an element.
            if (trackingValue) {
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
                clearTimeout(trackingInterval)
                trackingInterval = null
                console.log("Cleaning and stopping geotracking")
            }
        })

        const trackUser = (e: any) => {
            // Sometimes the hook is unable to provide coordinates.
            if (e === null || e.latlng === undefined) {
                console.log("No coordinates found. Skipping this iteration.")
                return
            }

            const radius = e.accuracy
            const userLocation = userTracking.currentLocation

            // Ignore possible error created by "setLatLng" method. 
            // Typescript error which will be fixed later.
            userLocation.setLatLng(e.latlng).addTo(map)
                .bindPopup(`Your location is within ${ radius } meters`)

            userTracking.coordinates.push(userLocation.getLatLng())
            drawLine(userTracking.coordinates, "track")
            compareLocationWithNextMarker()
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
        map.removeLayer(userTracking.currentLocation)
        map.removeLayer(userTracking.coordinates)

        userTracking.currentLocation = []
        userTracking.coordinates = []
    }

    const clearMapMarkersAndPolylines = () => {
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

    const calculateDistanceOfRoute = (route: any) => {
        // Calculate distance of the route generated by Leaflet routing plugin
        const waypoints = route.getWaypoints()
        console.log(waypoints)
        const routeSummary = waypoints[0].properties.distance // fetches only the distance of the first route

        return routeSummary
    }

    const compareLocationWithNextMarker = () => {
        if (waypointDetails.markers.length === 0) {
            console.log("No markers placed. Skipping next marker detection.")
            return
        }

        const locationCoordinates: Object = userTracking.currentLocation.getLatLng()
        const markersPassed: number = totalDistances.traveled.markersPassed.length

        if (waypointDetails.markers.length === markersPassed) {
            console.log("There's no more set markers. Session already ended.")
            return
        }

        const nextMarker: Object = waypointDetails.markers[markersPassed].getLatLng()

        let distanceToNextMarker = locationCoordinates.distanceTo(nextMarker)
        distanceToNextMarker = (distanceToNextMarker / 1000).toFixed(2)
        
        console.log(`Next marker is ${ distanceToNextMarker } ${ "km" } away`)

        if (distanceToNextMarker < 0.05) {
            console.log(`You have reached the waypoint ${ markersPassed + 1 } out of ${ waypointDetails.markers.length }.`)

            totalDistances.traveled.markersPassed.push(nextMarker)
            checkIfFinished()
        }
    }

    const checkIfFinished = () => {
        if (waypointDetails.markers.length === totalDistances.traveled.markersPassed.length) {
            console.log(`You have finished your planned session.`)
            console.log(`Do you want to continue to free roaming?`)
        }
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
    removeMarkersFunction.set(() => clearMapMarkersAndPolylines())
    createRouteFunction.set(() => createLeafletRouting())

</script>

<svelte:window on:resize={resizeMap} />

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
</svelte:head>

<div id="leaf-map" style="height: 100%; background-color: #333;" use:mapAction />