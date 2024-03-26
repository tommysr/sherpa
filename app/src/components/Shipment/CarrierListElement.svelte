<script lang="ts">
	import clsx from 'clsx';
	import type { ApiCarrierAccount } from '$src/utils/idl/carrier';

	export let carrierAccount: ApiCarrierAccount;
	export let selectedLocation: number | undefined;
	export let carrierId: number;

	let showModal = false;

	$: carrier = carrierAccount.account;
	$: location = carrier.availability.location;
	$: timeDifference = new Date(carrier.availability.time).getTime() - new Date().getTime();
	$: hoursInterval = Math.round(timeDifference / 1000 / 60 / 60);

	async function getLocationFromCoords(lat: number, long: number): Promise<string> {
		return `Kraków, Poland`;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	on:click
	class={clsx(
		'mt-4 rounded-lg shadow cursor-pointer',
		selectedLocation == carrierId ? 'bg-secondary-100' : 'bg-white'
	)}
>
	<div class="px-4 py-5 sm:px-6">
		<div class="flex items-center justify-between">
			<h3 class="sm:text-md xl:text-lg leading-6 font-medium text-gray-900">{carrier.name}</h3>
			<p
				class="mt-1 text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
			>
				In {hoursInterval} hours
			</p>
		</div>
		<div class="mt-3 xl:mt-5 flex items-center justify-between">
			<p class="text-xs xl:sm font-medium text-gray-500 mr-6 xl:mr-12">
				&#x2022; Offers count: {carrier.offersCount} <br />
				&#x2022; Tasks count: {carrier.tasksCount} <br />

				&#x2022;

				{#await getLocationFromCoords(location.latitude, location.longitude)}
					<article aria-busy="true"></article>
				{:then location}
					{location}
				{:catch error}
					{location.latitude.toFixed(4)} {location.longitude.toFixed(4)}
				{/await}

				<br />
				&#x2022; Available time:
				<span class={clsx('font-semibold', 'text-red-600')}>{carrier.availability.time}</span>
			</p>

			<button class="text-sm xl:text-md text-accent font-medium" on:click={() => (showModal = true)}
				>Show</button
			>
		</div>
	</div>
</li>

<!-- {#if selectedLocation === ca && showModal}
	<BoughtShipmentShowModal {shipmentAccount} bind:showModal />
{/if} -->
