<script lang="ts">
	import { Marker, Popup } from 'svelte-maplibre';
	import type { PageData } from './$types';
	import { getContext } from 'svelte';
	import * as maplibregl from 'maplibre-gl';
	import type { MapContext } from 'svelte-maplibre/context.svelte';

	export let data: PageData;
	$: carriers = data.carriers;

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: if ($store) {
		map = $store;
	}
</script>

<!-- CONSIDER: Moving this into layout, handling display with route match -->
<svelte:head><title>Carriers</title></svelte:head>
{#if map}
	{#each carriers as { account }}
		{@const location = account.availability.location}
		{@const name = account.name}
		{@const offersCount = account.offersCount}
		{@const acceptedCount = account.tasksCount}

		<Marker
			lngLat={[location.longitude, location.latitude]}
			class="grid h-8 w-8 place-items-center rounded-full border border-yellow-200 bg-red-300 text-black shadow-2xl focus:outline-2 focus:outline-black"
		>
			<span>
				<a href="/carriers/{account.authority}">{name}</a>
			</span>

			<Popup openOn="hover" offset={[0, -10]}>
				<div class="text-lg font-bold">offers: {offersCount}</div>
				<div class="text-lg font-bold">accepted: {acceptedCount}</div>
			</Popup></Marker
		>
	{/each}
{/if}
