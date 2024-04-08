<script lang="ts">
	import { Marker, Popup } from 'svelte-maplibre';
	import type { PageData } from './$types';

	export let data: PageData;
	$: carriers = data.carriers;
</script>

<!-- CONSIDER: Moving this into layout, allowing carrier to view other carriers nearby  -->
<svelte:head><title>Carriers</title></svelte:head>
{#each carriers as { account }}
	{@const location = account.availability.location}
	{@const name = account.name}
	{@const offersCount = account.offersCount}
	{@const acceptedCount = account.tasksCount}

	<Marker lngLat={[location.longitude, location.latitude]}>
		<div class="pin-carrier bounce-a cursor-pointer"></div>

		<Popup offset={[-5, -10]}>
			<div class="flex flex-col px-2 justify-center items-center">
				<div
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-base font-bold"
				>
					{name}
				</div>
				<div class="mt-2 text-neutral-600 text-sm">
					offers: {offersCount}
				</div>
				<div class="text-neutral-600 text-sm">
					accepted: {acceptedCount}
				</div>
			</div>
		</Popup></Marker
	>
{/each}
