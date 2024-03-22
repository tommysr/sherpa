<script lang="ts">
	import type { Map as Map$1 } from 'maplibre-gl';
	import { GeoJSON as GeoJson, LineLayer, MapLibre, Marker } from 'svelte-maplibre';

	import type { Geography } from '$src/utils/idl/shipment';
	import clsx from 'clsx';

	export let locations: Geography[];
	export let onMarkerClick: (location: number) => void;
	export let selectedLocation: number | undefined;

	const getMidPoint = ([x1, y1], [x2, y2]): [number, number] => [(x1 + x2) / 2, (y1 + y2) / 2];

	function onMarkerChange(i: number, map: Map$1, location: Geography) {
		onMarkerClick(i);
		selectedLocation = i;

		const midPoint = getMidPoint(
			[location.from.longitude, location.from.latitude],
			[location.to.longitude, location.to.latitude]
		);
		flyToLocation(map, midPoint);
	}

	function flyToLocation(map: Map$1, location: [number, number]) {
		map.flyTo({
			center: location,
			zoom: 8,
			duration: 2000,
			offset: [-200, 0]
		});
	}
</script>

<MapLibre
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	class="relative w-full sm:aspect-video h-screen z-0"
	zoom={5}
	center={[19, 50]}
	let:map
>
	{#each locations as location, i}
		<Marker
			on:click={() => onMarkerChange(i, map, location)}
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
</MapLibre>
