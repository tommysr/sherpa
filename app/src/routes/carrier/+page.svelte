<script lang="ts">
	import { Marker, Popup } from 'svelte-maplibre';
	import type { PageData } from './$types';

	export let data: PageData;
	$: carriers = data.carriers;

  $:console.log(carriers)
</script>

<!-- CONSIDER: Moving this into layout, allowing carrier to view other carriers nearby  -->
<!-- <svelte:head><title>Carriers</title></svelte:head>
{#each carriers as { account }}
	{@const location = account.availability.location}
	{@const name = account.name}
	{@const offersCount = account.offersCount}
	{@const acceptedCount = account.tasksCount}

	<Marker
		lngLat={[location.longitude, location.latitude]}
		class="grid h-14 w-14 place-items-center rounded-full border border-yellow-200 bg-red-300 text-black shadow-2xl focus:outline-2 focus:outline-black"
	>
		<span>
			<a href="/carriers/{account.authority}">{name}</a>
		</span>

		<Popup openOn="hover" offset={[0, -10]}>
			<div class="text-lg font-bold">offers: {offersCount}</div>
			<div class="text-lg font-bold">accepted: {acceptedCount}</div>
		</Popup></Marker
	>
{/each} -->
