<script lang="ts">
    import { getItemFromLocalStorage, addItemToLocalStorage } from "../services/localStorage-service"
    import { settings } from "../stores/hud-store"

    let appSettings: Object

    settings.subscribe(settingsObject => {
        appSettings = settingsObject
    })

    console.log("Application settings:", appSettings)
    
    const onInputChange = (event: any) => {
        let inputDetails: object = {
            value: null,
            name: null
        }
        
        if (event.target.type === "checkbox")
            inputDetails.value = event.target.checked
        
        else if (event.target.type === "number")
            inputDetails.value = event.target.value
        
        else console.log("Input type", event.target.type)
        
        inputDetails.name = event.target.name
        addItemToLocalStorage(inputDetails.name, inputDetails.value)
    }
</script>

<div id="settings-box">
    <h2>Settings</h2>

    <div class="flex">
        <div>
            <h3>Menus</h3>
            <ul>
                Display
                <li>Fade top display bar on idle <input type="checkbox" checked={ appSettings.menus.display.fadeTopOnIdle } on:change={ onInputChange } name="fadeTopOnIdle" /></li>
                <li>Fade right menu on idle <input type="checkbox" checked={ appSettings.menus.display.fadeRightOnIdle } on:change={ onInputChange } name="fadeRightOnIdle" /></li>
                <li>Fade bottom menu on idle <input type="checkbox" checked={ appSettings.menus.display.fadeBottomOnIdle } on:change={ onInputChange } name="fadeBottomOnIdle" /></li>
            </ul>
        </div>
        <div>
            <ul>
                Functionality
                <li>Enable idle functionality <input type="checkbox" checked={ appSettings.menus.functionality.enableIdle } on:change={ onInputChange } name="enableIdle" /></li>

                {#if appSettings.menus.functionality.enableIdle }
                    <li>App goes idle after <input type="number" value={ appSettings.menus.functionality.idleTimer } on:change={ onInputChange } name="idleTimer" /> seconds</li>
                {/if}
            </ul>
        </div>

        <div>
            <h3>App functionality</h3>
            <ul>
                General
                <li>Support offline mode <input type="checkbox" checked={ appSettings.appFunctionality.general.offlineMode } on:change={ onInputChange } name="offlineMode" /></li>
            </ul>
            <ul>
                Services
                <li>Allow application to use third-party services <input type="checkbox" checked={ appSettings.appFunctionality.services.allowThirdPartyServices } on:change={ onInputChange } name="allowThirdPartyServices" /></li>
            </ul>
        </div>
    </div>
</div>

<style>
    #settings-box {
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        margin: auto;
        padding: 0.5em 1em;
        max-width: 700px;
        max-height: 100%;
        overflow-y: scroll;
        color: #000;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(144, 144, 144, 0.4));
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    #settings-box {
        pointer-events: all;
    }

    .flex {
        display: flex;
        flex-direction: column;
    }

    .flex > div {
        min-width: 15rem;
    }
</style>