<script lang="ts">
export let value: boolean
export let label: string

const toggleValue = () => {
    value = !value
    console.log(value)
}
</script>

<button on:click={toggleValue}>{label}</button>