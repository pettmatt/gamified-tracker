export interface DistanceProvider {
    planned: {
        markerDistances: Array<number>
        getSum: Function
    }
    traveled: {
        markersPassed: Array<object>
        sum: number
    }
}

export interface Waypoints {
    coordinates: Array<Array<number>>
    markers: Array<Array<number>>
    polyline: any
}

export interface UserTracking {
    currentLocation: Array<number>
    coordinates: Array<Array<number>>
    polyline: any
}