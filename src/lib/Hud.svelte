<script lang="ts">
    import { sessionStartStatus, traveledDistance, placeMarkersStatus } from "../stores/hud-store"
    import { GeoAltFill, GeoAlt, Geo, GeoFill } from "svelte-bootstrap-icons"

    let unit = "m"

    const buttonArray = [
        { function: () => sessionStartStatus.update(boolean => !boolean), value: sessionStartStatus, label: "Start", icons: { default: Geo, checked: GeoFill } },
        { function: () => placeMarkersStatus.update(boolean => !boolean), value: placeMarkersStatus, label: "Plan", icons: { default: GeoAlt, checked: GeoAltFill } },
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
        <button id={button.label.toLowerCase()} on:click={button.function}>
            <svelte:component this={(button.value) ? button.icons.default : button.icons.checked} class="icon" />
            <small>{button.label}</small>
        </button>
    {/each}
</div>

<style>
    #interface-hud {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.3em;
        /* width: 100%; */
        padding: 0.5em 0;
        background-color: #333;
    }

    #travel-distance-container {
        margin: 0 4vw;
    }

    #travel-distance-container b {
        margin: 0 auto;
    }

    /* button > * {
        display: block;
        text-align: center;
        width: 100%;
    } */
</style>