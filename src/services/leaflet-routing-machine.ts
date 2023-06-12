import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"

const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

export const createRoute = (Leaflet: any, map: any, routeInstance: any = null, waypoints: Array<Array<Number>>) => {
    if (routeInstance !== null) {
        // Edit existing instance
        return routeInstance.setWaypoints(waypoints)
    }

    return Leaflet.Routing.control({
        waypoints,
        routeWhileDragging: true,
        router: Leaflet.Routing.mapbox(mapboxAccessToken, {
            profile: "mapbox/walking"
        }), // Uses Mapbox as the backend
        show: false // Disable the panel
    }).addTo(map)
}