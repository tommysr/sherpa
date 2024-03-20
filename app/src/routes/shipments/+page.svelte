<script lang="ts">
	import OrderCard from '$src/components/Shipment/OrderCard.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';

	import type { PageData } from './$types';
	import { searchableShipments } from '$src/stores/searchableShipments';

	export let data: PageData;

	$: locationsOnMap = $searchableShipments.data.map((s) => s.account.shipment.geography);
</script>

<svelte:head><title>Shipments list</title></svelte:head>

<main class="container">
	<div class="grid">
		<div class="px-5">
			{#if $searchableShipments.filtered.length != 0}
				{#each $searchableShipments.filtered as account}
					<OrderCard shipmentAccount={account} />
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>

		<!-- Map should be fixed or floating, and on mobile in some access menu from the right side, to allow quick preview -->
		<!-- CONSIDER: include filtering, more dynamic -->
		<div class="px-5"><ShipmentsMap locations={locationsOnMap} /></div>
	</div>
</main>

<style lang="scss">
</style>
