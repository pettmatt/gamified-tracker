<script lang="ts">
    import { getMapStatistics, placeMarkersStatus, sessionDetails, sessionStartStatus, traveledDistance } from "../../stores/hud-store"

    const distances = {
        current: null,
        goal: $sessionDetails.goal.distance
    }

    const createPrompt = () => {

    }

    const endSession = () => {
        sessionStartStatus.set(false)
        // const sessionStatistics = getMapStatistics()
    }

    traveledDistance.subscribe(currentDistance => {
        distances.current = currentDistance
    })
</script>

<h2>Session menu</h2>

<p>Progress: { distances.current } km</p>

{#if distances.goal}
    <p>Your goal: </p>
{/if}

<button on:click={ endSession }>End the session</button>