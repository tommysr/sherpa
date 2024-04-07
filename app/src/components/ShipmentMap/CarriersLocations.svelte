<script lang="ts">
	import { Marker, Popup } from 'svelte-maplibre';
	import clsx from 'clsx';
	import { getContext } from 'svelte';
	import type { MapContext } from 'svelte-maplibre/context.svelte';
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';

	export let carriers: ApiCarrierAccount[];
	export let selectedCarrier: number | undefined;
	export let onMarkerClick: (location: number) => void;
	export let isMobile: boolean;

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: displayedLocations = carriers;

	// $: if (selectedCarrier !== undefined && map) {
	// 	if (locationsWithName[selectedCarrier]) {
	// 		flyToLocation([
	// 			locationsWithName[selectedCarrier].location.longitude,
	// 			locationsWithName[selectedCarrier].location.latitude
	// 		]);
	// 	}
	// }

	$: if ($store) {
		map = $store;
	}

	const fitCarriersToBounds = () => {
		const bounds = map.getBounds();
		// TODO: add filtering

		displayedLocations = carriers.filter(
			({
				account: {
					availability: { location }
				}
			}) => bounds.contains([location.longitude, location.latitude])
		);
	};

	$: if (map) {
		map.on('dragend', (e) => {
			fitCarriersToBounds();
		});

		map.on('zoomend', (e) => {
			fitCarriersToBounds();
		});
	}

	$: console.log(displayedLocations.length);

	function onMarkerChange(i: number) {
		onMarkerClick(i);
		selectedCarrier = i;
	}

	function flyToLocation(location: [number, number]) {
		map.flyTo({
			center: location,
			zoom: isMobile ? 7 : 8,
			duration: 2000,
			offset: isMobile ? [0, -100] : [-200, 0]
		});
	}
</script>

{#each displayedLocations as { publicKey, account }, i}
	{@const name = account.name}
	{@const location = account.availability.location}
	{@const offersCount = account.offersCount}
	{@const taskCount = account.tasksCount}

	<Marker on:click={() => onMarkerChange(i)} lngLat={[location.longitude, location.latitude]}>
		<Popup>
			<p>Name: {name}</p>
			<p>Offers: {offersCount}</p>
			<p>Tasks: {taskCount}</p>
			<button class="border rounded-xl border-primary-500 px-2 py-1 text-sm font-md"
				>Make offer</button
			>
		</Popup>
		<div
			class={clsx(
				'carrier pin bounce cursor-pointer',
				selectedCarrier == i ? 'active' : 'inactive'
			)}
		></div>
		{#if selectedCarrier === i}
			<div class="pulse"></div>
		{/if}
	</Marker>
{/each}
