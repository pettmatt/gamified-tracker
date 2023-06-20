<script lang="ts">
    export let htmlContent: string = "<h2>Header</h2><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos aut temporibus a sunt, voluptates enim quod maxime dolore sint placeat laborum hic illo nobis. Pariatur excepturi deleniti sed tempore modi?</p>" 
</script>

<div class="notification-box">
    { @html htmlContent }
</div>