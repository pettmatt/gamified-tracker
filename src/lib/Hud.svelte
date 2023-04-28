<script lang="ts">
    import { sessionStartStatus, traveledDistance, placeMarkersStatus } from "../stores/hud-store"
    import ToggleButton from "./components/ToggleButton.svelte"

    let unit = "m"

    const buttonArray = [
        { function: sessionStartStatus.update(value => !value), label: "Start" },
        { function: placeMarkersStatus.update(value => !value), label: "Plan" },
    ]

</script>

<div id="interface-hud">
    {#each buttonArray as button, index}
        {#if buttonArray.length / 2 == index}
            {#if $sessionStartStatus}
                <div id="travel-distance-container">
                    <b>{$traveledDistance} {unit}</b>
                </div>
            <!-- {:else}
                <ToggleButton onClickFunction={toggleSessionStatus} label={"Start"} /> -->
            {/if}
        {/if}
        <ToggleButton onClickFunction={() => button.function} label={button.label} />
    {/each}
</div>

<style>
    #interface-hud {
        width: 100%;
        height: 1rem;
        background-color: #333;
    }

    b {
        margin: 0 4vw;
    }
</style>