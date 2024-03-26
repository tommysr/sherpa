<script lang="ts">
	import { MapLibre } from 'svelte-maplibre';

	export let darkMode = true;
	// export let unit: 'imperial' | 'metric' = 'metric';

	$: style = darkMode
		? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
		: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
</script>

<MapLibre {style} class="relative w-full sm:aspect-video h-screen z-0" zoom={5} center={[19, 50]}>
	<slot />
</MapLibre>

<!-- 
<MapLibre
	{style}
	class="map relative aspect-[9/16] max-h-[70vh] w-full sm:aspect-video sm:max-h-full"
	{zoom}
	{center}
	bind:bounds
	let:map
	attributionControl={false}
	on:load
>
	<slot {map} />

	<NavigationControl position="top-left" />
	<GeolocateControl
		position="top-left"
		fitBoundsOptions={{ maxZoom: 12 }}
		showAccuracyCircle={false}
	/>
	<ScaleControl {unit} />
	<FullscreenControl position="bottom-left" />

	<AttributionControl
		compact={true}
		customAttribution={`<strong class="text-red-500 rounded-lg">Maplibre</strong>`}
	/>
</MapLibre> -->
