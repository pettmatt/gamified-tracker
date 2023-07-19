<script lang="ts">
    export let position: string = "default"
</script>

<main>
    <div id="notification-box" class={ position }>
        <slot name="component" />
    </div>
</main>

<style>
    #notification-box {
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        padding: 0.5em 1em;
        max-width: 700px;
        max-height: 100%;
        overflow-y: scroll;
        color: #000;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(144, 144, 144, 0.4));
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    #notification-box {
        pointer-events: all;
    }
    .default {
        margin: auto;
    }
    .top {
        margin: 0 auto auto auto;
    }
</style>