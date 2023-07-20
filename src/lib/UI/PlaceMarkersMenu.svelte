<script lang="ts">
    import { createLoopFunction, createRouteFunction, sessionMarkers, placeMarkersStatus, plannedLength, removeLastMarker, removeMarkersFunction, routeLength, sessionDetails } from "../../stores/hud-store"

    const planSessionRoute = () => {
        sessionDetails.update(values => ({
            ...values,
            goal: {
                markers: $sessionMarkers,
                estimatedDistance: sessionLength.estimated,
                lengthSpecified: values.goal.lengthSpecified,
                distance: values.goal.distance,
                time: values.goal.distance
            }
        }))

        placeMarkersStatus.update((boolean) => !boolean)
        console.log($sessionDetails)
    }

    // Triggers the function passed by the map to hud-store
    const triggerFunction = (storeFunction: Function | undefined) => {
        if (typeof storeFunction === "function")
            storeFunction()
    }

    const checkIfFunctionIsAvailable = (func: Function | undefined) => {
        return typeof func === "function" ? false : true
    }

    const sessionLength = {
        estimated: 0,
        actual: 0
    }

    plannedLength.subscribe(distance => sessionLength.estimated = distance)
    routeLength.subscribe(distance => sessionLength.actual = distance)
</script>

<p>Place your markers by pressing a placement on the map</p>

{#if sessionLength.estimated > 0}
    <p>Estimated length: { (sessionLength.estimated).toFixed(2) } m</p>
{/if}

{#if sessionLength.actual > 0}
    <p>Length of the generated route: { (sessionLength.actual).toFixed(2) } m</p>
{/if}

<button on:click={ () => triggerFunction($removeMarkersFunction) } disabled={ checkIfFunctionIsAvailable($removeMarkersFunction) }>Remove all markers</button>
<button on:click={ () => triggerFunction($createLoopFunction) } disabled={ checkIfFunctionIsAvailable($createLoopFunction) }>Create a loop</button>
<button on:click={ () => triggerFunction($createRouteFunction) } disabled={ checkIfFunctionIsAvailable($createRouteFunction) }>Generate a route</button>
<!-- <button on:click={ () => triggerFunction($removeLastMarker) } disabled={ checkIfFunctionIsAvailable($removeLastMarker) }>Undo</button> -->
<button on:click={ planSessionRoute }>Done</button>

<style>
    p {
        text-align: center;
    }
</style>