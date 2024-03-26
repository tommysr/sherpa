<script lang="ts">
	import { Marker } from 'svelte-maplibre';
	import clsx from 'clsx';
	import { getContext } from 'svelte';
	import type { MapContext } from 'svelte-maplibre/context.svelte';
	import type { ApiCarrierAccount } from '$src/utils/idl/carrier';

	export let carriers: ApiCarrierAccount[];
	export let selectedCarrier: number | undefined;
	export let selectedLocation: number | undefined;
	export let onMarkerClick: (location: number) => void;
	export let isMobile: boolean;

	$: locationsWithName = carriers.map((carrier) => {
		return { name: carrier.account.name, location: carrier.account.availability.location };
	});

	$: if (selectedCarrier !== undefined) {
		if (locationsWithName[selectedCarrier]) {
			flyToLocation([
				locationsWithName[selectedCarrier].location.longitude,
				locationsWithName[selectedCarrier].location.latitude
			]);
		}
	}

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: if ($store) {
		map = $store;
	}

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

{#each locationsWithName as { name, location }, i}
	<Marker on:click={() => onMarkerChange(i)} lngLat={[location.longitude, location.latitude]}>
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
