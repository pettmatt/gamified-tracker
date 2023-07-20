<script lang="ts">
    import { onMount, onDestroy } from "svelte"
    import { sessionStartStatus, traveledDistance, placeMarkersStatus, settingsStatus, historyStatus, highscoresStatus, settingUpSessionStatus } from "../stores/hud-store"
    import { Trophy, TrophyFill, Archive, ArchiveFill, Geo, GeoFill, Gear, GearFill } from "svelte-bootstrap-icons"
    import ToggleButton from "./UI/ToggleButton.svelte"
    import NotificationBox from "./UI/NotificationBox.svelte"
    import Settings from "./UI/Settings.svelte"
    import SettingUpSession from "./UI/SettingUpSession.svelte"
    import PlaceMarkersMenu from "./UI/PlaceMarkersMenu.svelte"
    import SessionMenu from "./UI/SessionMenu.svelte";

    let unit = "m"

    let visibilityTop: boolean
    let visibilityBottom: boolean
    let inActivity: any

    onMount(() => {
        visibilityTop = false
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
        visibilityBottom = false
    }
    
    const showUIElements = () => {
        visibilityBottom = true
    }

    
    settingUpSessionStatus.subscribe(settingUpBoolean => {
        // Used to setting up the session and hand 
        // over the control of the setup phase
        let enteredSetupMode = false

        if (settingUpBoolean)
            enteredSetupMode = true
    })
</script>

<div id="interface-hud">
    <div class="interface-container">
        <div class="panel-top" class:fade-in-top={ visibilityTop } class:fade-out-top={ !visibilityTop }>
            {#if $sessionStartStatus}
                <div id="travel-distance-container">
                    <b>{ $traveledDistance } { unit }</b>
                </div>
            {/if}
        </div>
        <div class="middle-section-panels">
            <div class="panel-left" />
            <div class="panel-middle">
                {#if $settingUpSessionStatus}
                    <NotificationBox position={ ($placeMarkersStatus || $sessionStartStatus) ? "top" : "default" }>
                        <div slot="component">
                            {#if $sessionStartStatus}
                                <SessionMenu />

                            {:else if $placeMarkersStatus}
                                <!-- Why is this menu element here and not in the "else if" clause?
                                With this setup the placeMarkers menu will override the settings menu when needed -->
                                <PlaceMarkersMenu />

                            {:else if !$placeMarkersStatus}
                                <SettingUpSession />

                            {/if}
                        </div>
                    </NotificationBox>
                {/if}


                {#if $settingsStatus}
                    <Settings />
                {/if}

                {#if $historyStatus}
                    <NotificationBox>
                        <div slot="component">
                            <h2>History</h2>
                            <div>List of previous sessions</div>
                        </div>
                    </NotificationBox>
                {/if}

                {#if $highscoresStatus}
                    <NotificationBox>
                        <div slot="component">
                            <h2>Highscore</h2>
                            <div>Top 10 list of previous sessions</div>
                        </div>
                    </NotificationBox>
                {/if}
            </div>
            <div class="panel-right">
            </div>
        </div>
        <div class="panel-bottom" class:fade-in-bottom={ visibilityBottom } class:fade-out-bottom={ !visibilityBottom }>
            <ToggleButton label="History" icons={ { default: Archive, checked: ArchiveFill } } value={ $historyStatus } store={ historyStatus } />
            <ToggleButton label="Highscores" icons={ { default: Trophy, checked: TrophyFill } } value={ $highscoresStatus } store={ highscoresStatus } />
            <ToggleButton label="Session" icons={ { default: Geo, checked: GeoFill } } value={ $settingUpSessionStatus } store={ settingUpSessionStatus } />
            <!-- <ToggleButton label="Plan" icons={ { default: GeoAlt, checked: GeoAltFill } } value={ $placeMarkersStatus } store={ placeMarkersStatus } /> -->
            <ToggleButton label="Settings" icons={ { default: Gear, checked: GearFill } } value={ $settingsStatus } store={ settingsStatus } />
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

    #interface-hud .panel-top {
        text-align: center;
        color: #000;
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

    #travel-distance-container {
        margin: 0 4vw;
    }

    #travel-distance-container b {
        margin: 0 auto;
    }

    /* Animations */
    .fade-out-top {
        opacity: 0;
        transform: translateY(0%);
        transition:
            opacity 0.3s ease-in-out,
            transform 0.5s ease-in-out;
    }
    .fade-in-top {
        opacity: 1;
        transform: translateY(10%);
        transition:
            opacity 0.3s ease-in-out,
            transform 0.5s ease-in-out;
    }
    .fade-out-bottom {
        opacity: 0;
        transform: translateY(50%);
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
</style>