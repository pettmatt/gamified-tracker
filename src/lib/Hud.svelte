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
    <div class="panel">
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
</div>

<style>
    #interface-hud {
        position: relative;
        z-index: 99;
        /* height: 100%; */
    }

    #interface-hud > .panel {
        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.3em;
        padding: 0.5em 0;
        /* background-color: #333; */
    }

    #interface-hud .panel button {

    }

    #travel-distance-container {
        margin: 0 4vw;
    }

    #travel-distance-container b {
        margin: 0 auto;
    }
</style>