// File includes functionalities that are custom made for the map.
// More standard functionalities are still included in the Map component.
import { traveledDistance } from "../stores/hud-store"
import type { Waypoints, UserTracking, DistanceProvider } from "../interfaces/mapInterfaces"

const checkIfFinished = (waypointDetails: Waypoints, totalDistances: DistanceProvider) => {
    if (waypointDetails.markers.length === totalDistances.traveled.markersPassed.length) {
        console.log(`You have finished your planned session.`)
        console.log(`Do you want to continue to free roaming?`)
    }
}

export const compareLocationWithNextMarker = (waypointDetails: Waypoints, totalDistances: DistanceProvider, userTracking: UserTracking) => {
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
        checkIfFinished(waypointDetails, totalDistances)
    }

    return totalDistances.traveled
}

// NOT FUNCTIONAL. MAY REMOVE LATER IF STILL NOT IN USE
const calculateDistanceOfRoute = (route: any) => {
    // Calculate distance of the route generated by Leaflet routing plugin
    const waypoints = route.getWaypoints()
    console.log(waypoints)
    const routeSummary = waypoints[0].properties.distance // fetches only the distance of the first route

    return routeSummary
}

export const calculateNewTraveledDistance = (map: any, coordinates: Array<Array<number>>, currentSum: number) => {
    const distance = map.distance(coordinates[0], coordinates[coordinates.length - 1])
    const newDistance = currentSum + distance
    // Update the travel distance
    traveledDistance.update(value => newDistance)

    return newDistance
}