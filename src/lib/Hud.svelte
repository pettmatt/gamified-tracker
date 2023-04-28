<script lang="ts">
    import { sessionStartStatus, traveledDistance, placeMarkersStatus } from "../stores/hud-store"

    let unit = "m"

    const buttonArray = [
        { function: () => sessionStartStatus.set(!$sessionStartStatus), label: "Start" },
        { function: () => placeMarkersStatus.set(!$placeMarkersStatus), label: "Plan" },
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
        <button on:click={button.function}>{button.label}</button>
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