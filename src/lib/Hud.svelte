<script lang="ts">
import ToggleButton from "./components/ToggleButton.svelte"

export let valueArray: Array<boolean>
export let traveledDistance: number
export let sessionStarted: boolean

let unit = "m"
</script>

<div id="interface-hud">
    {#each valueArray as value, index}
        {#if valueArray.length / 2 == index}
            {#if sessionStarted}
                <div id="travel-distance-container">
                    <b>{traveledDistance} {unit}</b>
                </div>
            {:else}
                <ToggleButton value={sessionStarted} label={"Start"} />
            {/if}
        {/if}
        <ToggleButton value={value} label={"Button"} />
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