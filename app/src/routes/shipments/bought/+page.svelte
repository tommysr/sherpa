<script lang="ts">
	import BoughtShipmentCard from '$src/components/Shipment/BoughtShipmentCard.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';
	import { searchableBoughtShipments } from '$src/stores/forwarderShipments';
	import type { GeoLocation, Geography } from '$src/utils/idl/shipment';
	import type { ComponentEvents } from 'svelte';

	$: locationsOnMap = $searchableBoughtShipments.data.map((s) => s.account.shipment.geography);

	let center: [number, number] = [19, 50];

	function handleCardClick(e: ComponentEvents<BoughtShipmentCard>['cardFocus']) {
		const cardCoords = e.detail as Geography;

		const [lowerLongitude, higherLongitude] = [
			cardCoords.from.longitude,
			cardCoords.to.longitude
		].sort();

		const [lowerLatitude, higherLatitude] = [
			cardCoords.from.latitude,
			cardCoords.to.latitude
		].sort();

		const middle = {
			longitude: (lowerLongitude + higherLongitude) / 2,
			latitude: (lowerLatitude + higherLatitude) / 2
		};

		center = [middle.longitude, middle.latitude];
	}
</script>

<svelte:head><title>Forwarder shipments list</title></svelte:head>

<main class="container">
	<div class="grid">
		<div>
			{#if $searchableBoughtShipments.filtered.length != 0}
				{#each $searchableBoughtShipments.filtered as account}
					<BoughtShipmentCard boughtShipmentAccount={account} on:cardFocus={handleCardClick} />
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>
		<div>
			<ShipmentsMap locations={locationsOnMap} {center} />
		</div>
	</div>
</main>
