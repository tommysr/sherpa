<script>
	import OrderCard from '$src/components/Shipment/OrderCard.svelte';
	import { forwarderShipments } from '$src/stores/forwarderShipments';
</script>

<svelte:head><title>Forwarder shipments list</title></svelte:head>

<main class="container m-top">
	<div class="grid">
		<div>
			{#if $forwarderShipments.length != 0}
				{#each $forwarderShipments as account}
					<OrderCard shipmentAccount={account} />
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>
		<div></div>
	</div>
</main>

<style lang="scss">
	.m-top {
		margin-top: 20px;
	}
</style>
