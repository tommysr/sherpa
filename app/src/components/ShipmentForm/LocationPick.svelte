<script lang="ts">
	import {
		Control,
		ControlButton,
		ControlGroup,
		DefaultMarker,
		GeolocateControl,
		Popup
	} from 'svelte-maplibre';

	import { pickedLocations } from '$src/stores/locationsPick';

	export let showModal = false;
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

<DefaultMarker bind:lngLat={$pickedLocations.src} draggable>
	<Popup offset={[0, -10]}>
		<div class="text-lg font-bold">Package source</div>
	</Popup>
</DefaultMarker>

<DefaultMarker bind:lngLat={$pickedLocations.dst} draggable>
	<Popup offset={[0, -10]}>
		<div class="text-lg font-bold">Package destination</div>
	</Popup>
</DefaultMarker>
