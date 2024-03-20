<script lang="ts">
	import {
		DefaultMarker,
		MapLibre,
		Popup,
		type LngLatBoundsLike,
		DeckGlLayer
	} from 'svelte-maplibre';

	import { ArcLayer } from '@deck.gl/layers/typed';
	import type { Geography } from '$src/utils/idl/shipment';

	export let locations: Geography[];
	export let zoom: number = 10;
	export let center: [number, number] = [19, 50];
	let hovered: Geography;

	// TODO: render based by current map borders?
	let bounds: LngLatBoundsLike;
</script>

<MapLibre
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	class="map relative aspect-[9/16] max-h-[70vh] w-full sm:aspect-video sm:max-h-full"
	standardControls
	{zoom}
	{center}
	bind:bounds
>
	{#each locations as location}
		<DefaultMarker lngLat={[location.from.longitude, location.from.latitude]}>
			<Popup offset={[0, -10]}>
				<div class="text-lg font-bold">Package source</div>
			</Popup>
		</DefaultMarker>

		<DefaultMarker lngLat={[location.to.longitude, location.to.latitude]}>
			<Popup offset={[0, -10]}>
				<div class="text-lg font-bold">Package source</div>
			</Popup>
		</DefaultMarker>

		<DeckGlLayer
			type={ArcLayer}
			data={locations}
			bind:hovered
			getSourcePosition={(d) => [d.from.longitude, d.from.latitude]}
			getTargetPosition={(d) => [d.to.longitude, d.to.latitude]}
			getSourceColor={(d) => [222, 121, 70]}
			getTargetColor={(d) => [222, 121, 70]}
			getWidth={1}
		></DeckGlLayer>
	{/each}
</MapLibre>

<style>
	:global(.map) {
		height: 500px;
	}
</style>
