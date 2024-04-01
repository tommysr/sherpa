<script lang="ts">
	import {
		Control,
		ControlButton,
		ControlGroup,
		DefaultMarker,
		GeolocateControl,
		Popup,
		type MarkerClickInfo
	} from 'svelte-maplibre';

	import { pickedLocations } from '$src/stores/locationsPick';
	import { LngLat } from 'maplibre-gl';

	let srcLocation = new LngLat(50, 20);
	let dstLocation = new LngLat(50.2, 20.2);

	export let showModal = false;

	const onSourceDragEnd = (e: CustomEvent<MarkerClickInfo>) => {
		const newLocation = LngLat.convert(e.detail.lngLat);
		$pickedLocations.src = newLocation;
	};

	const onDestDragEnd = (e: CustomEvent<MarkerClickInfo>) => {
		const newLocation = LngLat.convert(e.detail.lngLat);
		$pickedLocations.dst = newLocation;
	};
</script>

<GeolocateControl
	position="top-left"
	fitBoundsOptions={{ maxZoom: 12 }}
	showAccuracyCircle={false}
/>
<Control position="top-left" class="flex flex-col gap-y-2">
	<ControlGroup>
		<ControlButton
			on:click={() => {
				showModal = true;
			}}
		>
			M</ControlButton
		></ControlGroup
	>
</Control>

<DefaultMarker on:dragend={onSourceDragEnd} bind:lngLat={srcLocation} draggable>
	<Popup offset={[0, -10]}>
		<div class="text-lg font-bold">Package source</div>
	</Popup>
</DefaultMarker>

<DefaultMarker on:dragend={onDestDragEnd} bind:lngLat={dstLocation} draggable>
	<Popup offset={[0, -10]}>
		<div class="text-lg font-bold">Package destination</div>
	</Popup>
</DefaultMarker>
