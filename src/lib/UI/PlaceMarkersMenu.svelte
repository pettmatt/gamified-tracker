<script lang="ts">
    import { createLoopFunction, createRouteFunction, placeMarkersStatus, removeLastMarker, removeMarkersFunction } from "../../stores/hud-store"

    const planSessionRoute = () => {
        placeMarkersStatus.update((boolean) => !boolean)
    }

    // Triggers the function passed by the map to hud-store
    const triggerFunction = (storeFunction) => {
        const { func, parameters } = storeFunction

        if (typeof func === "function")
            func(...parameters)
    }

    const checkIfFunctionIsAvailable = (func: Function | undefined) => {
        return typeof func === "function" ? false : true
    }
</script>

<p>Place your markers by pressing a placement on the map</p>

<button on:click={ () => triggerFunction($removeMarkersFunction) } disabled={ checkIfFunctionIsAvailable($removeMarkersFunction.func) }>Remove all markers</button>
<button on:click={ () => triggerFunction($createLoopFunction) } disabled={ checkIfFunctionIsAvailable($createLoopFunction.func) }>Create a loop</button>
<button on:click={ () => triggerFunction(createRouteFunction) } disabled={ checkIfFunctionIsAvailable($createRouteFunction.func) }>Generate the route</button>
<button on:click={ () => triggerFunction(removeLastMarker) } disabled={ checkIfFunctionIsAvailable($removeLastMarker.func) }>Undo</button>
<button on:click={ planSessionRoute }>Done</button>

<style>
    p {
        text-align: center;
    }
</style>