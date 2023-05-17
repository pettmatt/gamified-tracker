const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

// If application needed to check the elevation through out the route.
// Return array of elevation values.
export const fetchElevationDetails = (coordinates: Array<Array<number>>) => {
    if (!mapboxAccessToken) return
    
    const requestUrl = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coordinates.join(';')}.json?layers=contour&limit=50&access_token=${mapboxAccessToken}`
    
    const elevationResponse = fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            const elevations = data.features.map(feature => feature.properties.ele)
            console.log('Elevations data:', elevations)
            return elevations
        })
        .catch(error => {
            console.log('An error occurred while fetching elevation data:', error)
            return error
        })

    return elevationResponse
}