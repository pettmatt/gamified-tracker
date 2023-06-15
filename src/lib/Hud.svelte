<script lang="ts">
    import { onMount } from "svelte"
    import { sessionStartStatus, traveledDistance, placeMarkersStatus } from "../stores/hud-store"
    import { GeoAltFill, GeoAlt, Geo, GeoFill } from "svelte-bootstrap-icons"

    let unit = "m"

    const buttonArray = [
        { function: () => sessionStartStatus.update(boolean => !boolean), value: sessionStartStatus, label: "Start", icons: { default: Geo, checked: GeoFill } },
        { function: () => placeMarkersStatus.update(boolean => !boolean), value: placeMarkersStatus, label: "Plan", icons: { default: GeoAlt, checked: GeoAltFill } },
    ]

    let visibilityBottom: Boolean
    let visibilityTop: Boolean

    onMount(() => {
        visibilityBottom = true
        visibilityTop = false
    })

</script>

<div id="interface-hud">
    <div class="interface-container">
        <div class="panel-top" class:fade-in={ !visibilityTop } class:fade-out={ visibilityTop }>
            {#if $sessionStartStatus}
                <div id="travel-distance-container">
                    <b>{$traveledDistance} {unit}</b>
                </div>
                <!-- {:else}
                <ToggleButton onClickFunction={toggleSessionStatus} label={"Start"} /> -->
            {/if}
        </div>
        <div class="middle-section-panels">
            <div class="panel-left" />
            <div class="panel-middle"></div>
            <div class="panel-right">
                <button on:click={ () => visibilityTop = !visibilityTop }>Top</button>
                <button on:click={ () => visibilityBottom = !visibilityBottom }>Bot</button>
            </div>
        </div>
        <div class="panel-bottom" class:fade-in={ !visibilityBottom } class:fade-out={ visibilityBottom }>
            {#each buttonArray as button, index}
                {#if buttonArray.length / 2 == index}
                    <!-- Put an element at the center point of the panel -->
                    <!-- Should be used on elements that need to be at the center -->
                {/if}
                <button id={button.label.toLowerCase()} on:click={button.function}>
                    <svelte:component this={(button.value) ? button.icons.default : button.icons.checked} class="icon" />
                    <small>{button.label}</small>
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    #interface-hud {
        position: absolute;
        margin: 1rem;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 99;
        pointer-events: none;
    }

    .interface-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .middle-section-panels {
        display: flex;
        flex-direction: row;
        height:100%;
    }

    #interface-hud .panel-top,
    #interface-hud .panel-bottom {
        flex: 0 1 auto;
    }

    #interface-hud .panel-right,
    #interface-hud .panel-left {
        flex: 0 0 2rem;
        margin: auto 0;
    }

    #interface-hud .panel-bottom,
    #interface-hud .panel-right {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.3em;
        padding: 0.5em 0;
    }

    #interface-hud .panel-right {
        flex-direction: column;
        padding: 0 0.5em;
    }

    #interface-hud .panel-right button {
        /* border-radius: 1.5rem; */
        /* width: 3rem; */
        /* height: 3rem; */
    }

    #interface-hud .panel-middle {
        flex: 1 1 auto;
    }

    #interface-hud .panel-top button,
    #interface-hud .panel-bottom button,
    #interface-hud .panel-center button,
    #interface-hud .panel-right button {
        pointer-events: all;
    }

    #travel-distance-container {
        margin: 0 4vw;
    }

    #travel-distance-container b {
        margin: 0 auto;
    }

    /* Animations */
    .fade-out {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    .fade-in {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
    }
</style>