<script lang="ts">
    import { writable } from "svelte/store"

    interface iconsObject {
        default: Function,
        checked: Function
    }

    export let label: string = "Label"
    export let icons: iconsObject = { default: null, checked: null }
    export let value: boolean = false
    export let store: object = writable(false)
    export let storeUpdateFunction: Function = (boolean) => !boolean
</script>

<button id={`button-${ label.toLowerCase() }`} class:highlight={ value } 
    on:click={ () => store.update(storeUpdateFunction) }
>
    <svelte:component this={ value ? icons.checked : icons.default } class="icon" />
    <small>{ label }</small>
</button>


<style>
    .highlight {
        border: solid 2px;
        border-color: #646cff;
    }

    button {
        pointer-events: all;
    }
</style>