<script lang="ts">
	import {
		DefaultMarker,
		MapLibre,
		Popup,
		type LngLatLike,
		GeolocateControl
	} from 'svelte-maplibre';
	import { type MapMouseEvent, type Map } from 'maplibre-gl';

	// TODO: source location should be passed, but
	// think about some default value to user
	// Destination location should be somewhere close to source to avoid
	// scrolling too much
	export let sourceLocation: LngLatLike = { lon: 15, lat: 50 };
	export let destinationLocation: LngLatLike = { lon: 16, lat: 51 };

	type MapMoveEndEvent = CustomEvent<MapMouseEvent & { map: Map } & { geolocateSource?: boolean }>;

	function handleGeoClick(e: MapMoveEndEvent) {
		if (!e.detail.geolocateSource) {
			return;
		}

		let mapLocation = e.detail.map.getCenter();
		// add little offset, because of the map circle
		mapLocation.lat -= -0.01;
		sourceLocation = mapLocation;
	}

	function handleMoveEnd(e: MapMoveEndEvent) {
		handleGeoClick(e);
	}
</script>

<MapLibre
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	class="map relative aspect-[9/16] max-h-[70vh] w-full sm:aspect-video sm:max-h-full"
	zoom={10}
	center={[19, 50]}
	on:moveend={handleMoveEnd}
>
	<GeolocateControl
		position="top-left"
		fitBoundsOptions={{ maxZoom: 12 }}
		showAccuracyCircle={false}
	/>
	<DefaultMarker bind:lngLat={sourceLocation} draggable>
		<Popup offset={[0, -10]}>
			<div class="text-lg font-bold">Package source</div>
		</Popup>
	</DefaultMarker>

	<DefaultMarker bind:lngLat={destinationLocation} draggable>
		<Popup offset={[0, -10]}>
			<div class="text-lg font-bold">Package destination</div>
		</Popup>
	</DefaultMarker>
</MapLibre>

<style>
	:global(.map) {
		height: 500px;
	}
</style>
