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

	let srcLocation = $pickedLocations.src;
	let dstLocation = $pickedLocations.dst;

	export let showModal = false;

	const onDragEnd = (e: CustomEvent<MarkerClickInfo>) => {
		pickedLocations.update((store) => {
			store.dst = dstLocation;
			store.src = srcLocation;

			return store;
		});
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
		>
	</ControlGroup>
</Control>

<DefaultMarker on:dragend={onDragEnd} bind:lngLat={srcLocation} draggable>
	<Popup offset={[0, -10]}>
		<div class="text-lg font-bold">Package source</div>
	</Popup>
</DefaultMarker>

<DefaultMarker on:dragend={onDragEnd} bind:lngLat={dstLocation} draggable>
	<Popup offset={[0, -10]}>
		<div class="text-lg font-bold">Package destination</div>
	</Popup>
</DefaultMarker>
