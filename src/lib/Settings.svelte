<script lang="ts">

</script>

<div id="settings-box">
    <h2>Settings</h2>

    <div class="flex">
        <div>
            <h3>Menus</h3>
            <ul>
                Display
                <li>Fade top display bar on idle <input type="checkbox" /></li>
                <li>Fade right menu on idle <input type="checkbox" /></li>
                <li>Fade bottom menu on idle <input type="checkbox" /></li>
            </ul>
        </div>
        <div>
            <ul>
                Functionality
                <li>Enable idle functionality <input type="checkbox" checked={ true } /></li>
                <li>App goes idle after <input type="number" value={ 10 } /> seconds</li>
            </ul>
        </div>

        <div>
            <h3>App functionality</h3>
            <ul>
                General
                <li>Support offline mode <input type="checkbox" checked={ true } /></li>
            </ul>
            <ul>
                Services
                <li>Allow application to use third-party services <input type="checkbox" checked={ false } /></li>
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