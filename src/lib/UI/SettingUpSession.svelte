<script lang="ts">
    import { placeMarkersStatus, sessionDetails, sessionStartStatus, settingUpSessionStatus } from "../../stores/hud-store"

    const startSession = () => {
        sessionDetails.update(values => {
            const lengthSpecified = document.getElementsByName("SpecifySessionLength")[0].checked

            return {
                ...values,
                category: document.getElementsByName("SessionCategory")[0].value,
                goal: {
                    markers: values.goal.markers,
                    estimatedDistance: values.goal.estimatedDistance,
                    lengthSpecified: lengthSpecified,
                    distance: lengthSpecified ? document.getElementsByName("GoalDistance")[0].value : values.goal.distance,
                    time: lengthSpecified ? document.getElementsByName("GoalTime")[0].value : values.goal.time
                }
            }
        })

        console.log($sessionDetails)

        settingUpSessionStatus.set(false)
        sessionStartStatus.set(true)
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
    <select name="SessionCategory">
        <option value="running">Running</option>
        <option value="walking">Walking</option>
        <option value="cycling">Cycling</option>
    </select>
</div>
<div>
    Plan your route <button on:click={ planSessionRoute }>Plan</button>
</div>
<div>
    Specify session length goals <input type="checkbox" name="SpecifySessionLength" on:change={ handleOnChange } />
</div>

{#if specifySessionLength}
    <div>Session time goal <input type="number" name="GoalTime" value="20" /> mins</div>
    <div>Session distance goal <input type="number" name="GoalDistance" value="3" /> km</div>
{/if}

<button on:click={ startSession }>Start the session</button>