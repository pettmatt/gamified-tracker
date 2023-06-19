<script lang="ts">
    import { onMount, onDestroy } from "svelte"
    import { sessionStartStatus, traveledDistance, placeMarkersStatus } from "../stores/hud-store"
    import { GeoAltFill, GeoAlt, Geo, GeoFill } from "svelte-bootstrap-icons"

    let unit = "m"

    interface Button {
        label: string,
        icons: { default: Function, checked: Function },
        value: any,
        onClick: () => void,
    }

    const createButton = (
        label: string,
        icons: Button["icons"],
        store: Object,
        value: Boolean,
        updateFunction: (value: boolean) => boolean
    ) => {
        return {
            label,
            icons,
            value,
            onClick: () => store.update(updateFunction)
        }
    }

    const buttonArray: Array<Button> = [
        createButton("Start", { default: Geo, checked: GeoFill }, sessionStartStatus, $sessionStartStatus, (boolean) => !boolean),
        createButton("Plan", { default: GeoAlt, checked: GeoAltFill }, placeMarkersStatus, $placeMarkersStatus, (boolean) => !boolean)
    ]

    let displayNotification: Boolean
    let visibilityTop: Boolean
    let visibilityRight: Boolean
    let visibilityBottom: Boolean
    let inActivity: any

    onMount(() => {
        displayNotification = false
        visibilityTop = false
        visibilityRight = true
        visibilityBottom = true

        addInactivityTimers()
    })

    onDestroy(() => {
        removeInactivityTimers()
    })

    const addInactivityTimers = () => {
        inActivity = setTimeout(() => {
            // Disable UI elements if screen is inactive.
            // This should NOT override settings.
            hideUIElements()
        }, 10000)

        window.addEventListener("click", resetTimer)
        window.addEventListener("keydown", resetTimer)
        window.addEventListener("mousemove", resetTimer)
        window.addEventListener("touchmove", resetTimer)
        window.addEventListener("scroll", resetTimer)
    }

    const removeInactivityTimers = () => {
        clearTimeout(inActivity)
        window.removeEventListener("click", resetTimer)
        window.removeEventListener("keydown", resetTimer)
        window.removeEventListener("mousemove", resetTimer)
        window.removeEventListener("touchmove", resetTimer)
        window.removeEventListener("scroll", resetTimer)
    }

    const resetTimer = () => {
        showUIElements()
        clearTimeout(inActivity)
        inActivity = setTimeout(hideUIElements, 10000)
    }

    const hideUIElements = () => {
        visibilityRight = false
        visibilityBottom = false
    }

    const showUIElements = () => {
        visibilityRight = true
        visibilityBottom = true
    }
</script>

<div id="interface-hud">
    <div class="interface-container">
        <div class="panel-top" class:fade-in-bottom={ visibilityTop } class:fade-out-bottom={ !visibilityTop }>
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
            <div class="panel-middle">
                {#if displayNotification }
                    <div class="notification-box">
                        <h2>Testing</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos aut temporibus a sunt, voluptates enim quod maxime dolore sint placeat laborum hic illo nobis. Pariatur excepturi deleniti sed tempore modi?</p>
                    </div>
                {/if}
            </div>
            <div class="panel-right" class:fade-in-right={ visibilityRight } class:fade-out-right={ !visibilityRight }>
                <button on:click={ () => visibilityTop = !visibilityTop }>Top</button>
                <button on:click={ () => visibilityBottom = !visibilityBottom }>Bot</button>
            </div>
        </div>
        <div class="panel-bottom" class:fade-in-bottom={ visibilityBottom } class:fade-out-bottom={ !visibilityBottom }>
            {#each buttonArray as button, index}
                {#if buttonArray.length / 2 == index}
                    <!-- Put an element at the center point of the panel -->
                    <!-- Should be used on elements that need to be at the center -->
                {/if}
                <button id={`button-${index}`} class:highlight={ button.value } on:click={ button.onClick }>
                    <svelte:component this={ button.value ? button.icons.checked : button.icons.default } class="icon" />
                    <small>{ button.label }</small>
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

    .notification-box {
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        margin: auto;
        padding: 0.5em;
        max-width: 700px;
        max-height: 100%;
        overflow-y: scroll;
        color: #000;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(144, 144, 144, 0.4));
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .notification-box > * {
        text-align: center;
    }

    .highlight {
        border: solid 2px;
        border-color: #646cff;
    }

    /* Animations */
    .fade-out-bottom {
        opacity: 0;
        transform: translateY(100%);
        transition:
            opacity 0.3s ease-in-out,
            transform 0.5s ease-in-out;
    }
    .fade-in-bottom {
        opacity: 1;
        transform: translateY(0%);
        transition:
            opacity 0.3s ease-in-out,
            transform 0.5s ease-in-out;
    }
    .fade-out-right{
        opacity: 0;
        transform: translateX(100%);
        transition:
            opacity 0.3s ease-in-out,
            transform 0.5s ease-in-out;
    }
    .fade-in-right {
        opacity: 1;
        transform: translateX(0%);
        transition:
            opacity 0.3s ease-in-out,
            transform 0.5s ease-in-out;
    }
</style>