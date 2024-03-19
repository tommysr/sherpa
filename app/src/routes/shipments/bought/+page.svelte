<script>
	import BoughtShipmentCard from '$src/components/Shipment/BoughtShipmentCard.svelte';
	import { searchableBoughtShipments } from '$src/stores/forwarderShipments';
</script>

<svelte:head><title>Forwarder shipments list</title></svelte:head>

<main class="container">
	<div class="grid">
		<div>
			{#if $searchableBoughtShipments.filtered.length != 0}
				{#each $searchableBoughtShipments.filtered as account}
					<BoughtShipmentCard boughtShipmentAccount={account} />
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>
		<div></div>
	</div>
</main>
