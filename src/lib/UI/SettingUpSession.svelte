<script lang="ts">
    import { placeMarkersStatus, sessionStartStatus, settingUpSessionStatus } from "../../stores/hud-store";

    const startSession = () => {
        settingUpSessionStatus.update(() => false)
        sessionStartStatus.update(() => true)
    }

    let specifySessionLength = false

    const handleOnChange = (event: any) => {
        if (event.target.name === "SpecifySessionLength")
            specifySessionLength = !specifySessionLength

        else console.log("Handle on change function did nothing")
    }

    const planSessionRoute = () => {
        placeMarkersStatus.update((boolean) => !boolean)
    }
</script>

<h2>Setting up session</h2>

<div>Sport category 
    <select>
        <option>Running</option>
        <option>Walking</option>
        <option>Cycling</option>
    </select>
</div>
<div>
    Plan your route <button on:click={ planSessionRoute }>{ $placeMarkersStatus ? "Plan" : "Done"}</button>
</div>
<div>
    Specify session length goals <input type="checkbox" name="SpecifySessionLength" on:change={ handleOnChange } />
</div>

{#if specifySessionLength}
    <div>Session time goal <input type="number" value="20" /> mins</div>
    <div>Session distance goal <input type="number" value="3" /> km</div>
{/if}

<button on:click={ startSession }>Start the session</button>