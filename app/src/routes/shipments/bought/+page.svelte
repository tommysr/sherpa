<script lang="ts">
	import BoughtShipmentCard from '$src/components/Shipment/BoughtShipmentCard.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';
	import { searchableBoughtShipments } from '$src/stores/forwarderShipments';
	import type { GeoLocation, Geography } from '$src/utils/idl/shipment';
	import type { ComponentEvents } from 'svelte';
	import type { PageData } from './$types';
	import { Marker, Popup } from 'svelte-maplibre';
	import CategoryButton from '$src/components/Buttons/CategoryButton.svelte';
	import SimpleButton from '$src/components/Buttons/SimpleButton.svelte';

	export let data: PageData;

	$: locationsOnMap = $searchableBoughtShipments.data.map((s) => s.account.shipment.geography);

	$: carriers = data.carriers;

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
			<ShipmentsMap locations={locationsOnMap} {center}>
				<!-- <DefaultMarker lngLat={[location.from.longitude, location.from.latitude]}>
					<Popup offset={[0, -10]}>
						<div class="text-lg font-bold">Package source</div>
					</Popup>
				</DefaultMarker> -->
				{#each carriers as { account }}
					{@const {
						location: { latitude, longitude },
						time
					} = account.availability}

					{@const { name } = account}

					<Marker
						lngLat={[longitude, latitude]}
						on:click={() => console.log('clicked', time)}
						class="grid h-8 w-8 place-items-center rounded-xl border border-2 border-[theme(colors.green)] bg-red-400 text-[theme(colors.green)]  shadow-2xl focus:outline-2 focus:outline-black"
					>
						<span>
							{name}
						</span>

						<Popup openOn="hover" offset={[0, -10]}>
							<div class="flex flex-col">
								<span class="text-sm font-bold text-[theme(colors.mint)]"
									>available time: {new Date(time).toUTCString()}
								</span>

								<SimpleButton
									class="border-[theme(colors.mint)] text-[theme(colors.mint)]"
									value={'make offer'}
								/>
							</div>
						</Popup>
					</Marker>
				{/each}
			</ShipmentsMap>
		</div>
	</div>
</main>
