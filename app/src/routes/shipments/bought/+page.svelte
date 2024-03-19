<script>
	import OrderCard from '$src/components/Shipment/OrderCard.svelte';
	import { searchableBoughtShipments } from '$src/stores/forwarderShipments';
</script>

<svelte:head><title>Forwarder shipments list</title></svelte:head>

<main class="container m-top">
	<div class="grid">
		<div>
			{#if $searchableBoughtShipments.filtered.length != 0}
				{#each $searchableBoughtShipments.filtered as account}
					<!-- <OrderCard shipmentAccount={account} /> -->
					<p>{account.account.buyer}</p>
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
