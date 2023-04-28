<script lang="ts">
    export let onClickFunction: Function 
    export let label: string
</script>

<button on:click={() => onClickFunction()}>{label}</button>