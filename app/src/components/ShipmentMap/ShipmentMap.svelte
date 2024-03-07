<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { DefaultMarker, MapLibre, Marker, Popup } from 'svelte-maplibre';

	// TODO: source location should be passed, but
	// think about some default value to user
	// Destination location should be somewhere close to source to avoid
	// scrolling too much
	export let sourceLocation: [number, number] = [19, 51];
	export let destinationLocation: [number, number] = [20, 50];
</script>

<MapLibre
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	class="map relative aspect-[9/16] max-h-[70vh] w-full sm:aspect-video sm:max-h-full"
	standardControls
	zoom={10}
	center={[19, 50]}
>
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
