<script lang="ts">
	import type { Geography } from '$src/utils/account/shipment';
	import clsx from 'clsx';
	import { LngLatBounds } from 'maplibre-gl';
	import { getContext } from 'svelte';
	import { GeoJSON as GeoJson, LineLayer, Marker } from 'svelte-maplibre';
	import type { MapContext } from 'svelte-maplibre/context.svelte';

	export let locations: Geography<string>[];
	export let selectedLocation: number | undefined;
	export let onMarkerClick: (location: number) => void;
	export let isMobile: boolean;

	export let exclusive: boolean;

	// const getMidPoint = ([x1, y1], [x2, y2]): [number, number] => [(x1 + x2) / 2, (y1 + y2) / 2];

	const getBounds = ([lng1, lat1], [lng2, lat2]): LngLatBounds => {
		return new LngLatBounds([
			Math.min(lng1, lng2),
			Math.min(lat1, lat2),
			Math.max(lng1, lng2),
			Math.max(lat1, lat2)
		]);
	};

	// TODO: consider bounds with current zoom, if they will include it
	$: if (selectedLocation !== undefined) {
		if (locations[selectedLocation]) {
			flyToLocation(
				getBounds(
					[locations[selectedLocation].from.longitude, locations[selectedLocation].from.latitude],
					[locations[selectedLocation].to.longitude, locations[selectedLocation].to.latitude]
				)
			);
		}
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

	function flyToLocation(bounds: LngLatBounds) {
		map.fitBounds(bounds, {
			duration: 2000,
			animate: true,
			// offset: isMobile ? [0, -100] : [-200, 0], 
			// padding: {'right': 600, 'left':100}, 
			padding: 100
		});
		// map.flyTo({
		// 	center: location,
		// 	zoom: isMobile ? 7 : 8,
		// 	duration: 2000,
		// 	offset: isMobile ? [0, -100] : [-200, 0]
		// });
	}
</script>

{#each locations as location, i}
	{#if exclusive && selectedLocation !== i}
		<div></div>
	{:else}
		<Marker
			on:click={() => onMarkerChange(i)}
			lngLat={[location.from.longitude, location.from.latitude]}
		>
			<div
				class={clsx('pin bounce-a cursor-pointer', selectedLocation == i ? 'active' : 'inactive')}
			></div>
			{#if selectedLocation === i}
				<div class="pulse"></div>
			{/if}
		</Marker>
	{/if}

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
