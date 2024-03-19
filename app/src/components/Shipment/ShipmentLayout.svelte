<script lang="ts">

</script>

<svelte:head><title>Orders</title></svelte:head>

<main class="container">
	<slot name="menus" />
	<div class="grid">
		<div>
            <slot name="shipments"/>
		</div>

        
		<!-- Map should be fixed or floating, and on mobile in some access menu from the right side, to allow quick preview -->
		<!-- CONSIDER: include filtering, more dynamic -->
		<div>
            <slot name="panel"/>
        </div>
	</div>
</main>

<style lang="scss">
</style>
