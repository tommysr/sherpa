<script lang="ts">
	import { Map as Map$1 } from 'maplibre-gl';
	import { GeoJSON as GeoJson, LineLayer, MapLibre, Marker } from 'svelte-maplibre';

	import type { Geography } from '$src/utils/idl/shipment';
	import clsx from 'clsx';
	import { getContext } from 'svelte';
	import type { MapContext } from 'svelte-maplibre/context.svelte';

	export let locations: Geography[];
	export let selectedLocation: number | undefined;
	export let onMarkerClick: (location: number) => void;
	export let isMobile: boolean;

	const getMidPoint = ([x1, y1], [x2, y2]): [number, number] => [(x1 + x2) / 2, (y1 + y2) / 2];

	$: if (selectedLocation !== undefined) {
		flyToLocation(
			getMidPoint(
				[locations[selectedLocation].from.longitude, locations[selectedLocation].from.latitude],
				[locations[selectedLocation].to.longitude, locations[selectedLocation].to.latitude]
			)
		);
	}

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: if ($store) {
		map = $store;
	}

	function onMarkerChange(i: number) {
		onMarkerClick(i);
		selectedLocation = i;
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

{#each locations as location, i}
	<Marker
		on:click={() => onMarkerChange(i)}
		lngLat={[location.from.longitude, location.from.latitude]}
	>
		<div
			class={clsx('pin bounce cursor-pointer', selectedLocation == i ? 'active' : 'inactive')}
		></div>
		{#if selectedLocation === i}
			<div class="pulse"></div>
		{/if}
	</Marker>

	{#if selectedLocation === i}
		<Marker lngLat={[location.to.longitude, location.to.latitude]}>
			<div class={clsx('pin', 'active')}></div>
			<div class="pulse"></div>
		</Marker>

		<GeoJson
			data={{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'LineString',
					coordinates: [
						[location.from.longitude, location.from.latitude],
						[location.to.longitude, location.to.latitude]
					]
				}
			}}
		>
			<LineLayer
				layout={{
					'line-cap': 'round',
					'line-join': 'round'
				}}
				paint={{
					'line-width': 1,
					'line-color': '#3b2871',
					'line-opacity': 0.8
				}}
			/>
		</GeoJson>
	{/if}
{/each}
