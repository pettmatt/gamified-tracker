import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"

const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

export const createRoute = (Leaflet: any, map: any, waypoints: Array<Array<Number>>) => {
    return Leaflet.Routing.control({
        waypoints,
        routeWhileDragging: true,
        router: Leaflet.Routing.mapbox(mapboxAccessToken, {
            profile: "mapbox/walking"
        }), // Uses Mapbox as the backend
        show: false // Disable the panel
    }).addTo(map)
}