<script lang="ts">
	import { Marker } from 'svelte-maplibre';
	import clsx from 'clsx';
	import { getContext } from 'svelte';
	import type { MapContext } from 'svelte-maplibre/context.svelte';
	import type { ApiCarrierAccount } from '$src/utils/idl/carrier';
	import type { LngLatBounds } from 'maplibre-gl';

	export let carriers: ApiCarrierAccount[];
	export let selectedCarrier: number | undefined;
	export let onMarkerClick: (location: number) => void;
	export let isMobile: boolean;

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: locationsWithName = carriers.map((carrier) => {
		return { name: carrier.account.name, location: carrier.account.availability.location };
	});

	$: if (selectedCarrier !== undefined && map) {
		if (locationsWithName[selectedCarrier]) {
			flyToLocation([
				locationsWithName[selectedCarrier].location.longitude,
				locationsWithName[selectedCarrier].location.latitude
			]);
		}
	}

	$: if ($store) {
		map = $store;
	}

	$: if (map) {
		map.on('dragend', (e) => {
			const bounds = map.getBounds();
			// TODO: add filtering
			// filterByBounds(bounds);
		});

		map.on('zoomend', (e) => {
			const bounds = map.getBounds();
			// filterByBounds(bounds);
		});
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
