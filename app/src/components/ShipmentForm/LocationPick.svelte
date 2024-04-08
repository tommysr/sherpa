<script lang="ts">
	import { Marker, Popup, type MarkerClickInfo } from 'svelte-maplibre';

	import { pickedLocations } from '$src/stores/locationsPick';

	let srcLocation = $pickedLocations.src;
	let dstLocation = $pickedLocations.dst;

	export let showModal = false;
	export let type: 'single' | 'double' = 'single';

	const onDragEnd = (e: CustomEvent<MarkerClickInfo>) => {
		pickedLocations.update((store) => {
			store.dst = dstLocation;
			store.src = srcLocation;

			return store;
		});
	};
</script>

<div class="fixed top-2/3 transform left-1/2 -translate-x-1/2">
	<div
		class="flex flex-col justify-between items-center bg-gradient-to-r from-primary to-secondary px-4 py-3 rounded-3xl hover:scale-105 transition-all ease-in-out duration-150 shadow-lg"
	>
		<button
			class=" text-white text-lg"
			on:click={() => {
				showModal = true;
			}}
		>
			Confirm location
		</button>
	</div>
</div>

<Marker on:dragend={onDragEnd} bind:lngLat={srcLocation} draggable>
	<div class="pin active"></div>

	{#if type === 'double'}
		<Popup open offset={[-5, -10]}>
			<div class="text-sm font-bold">From</div>
		</Popup>
	{/if}
</Marker>

{#if type === 'double'}
	<Marker on:dragend={onDragEnd} bind:lngLat={dstLocation} draggable>
		<div class="pin active"></div>
		<Popup open offset={[-5, -10]}>
			<div class="text-sm font-bold">To</div>
		</Popup>
	</Marker>
{/if}
