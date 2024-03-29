<script lang="ts">
	import type {
		ApiShipmentAccount,
		Geography,
		ShipmentDetails,
		ShipmentDimensions
	} from '$src/utils/account/shipment';
	import type { Entries } from '$src/utils/types/object';
	import clsx from 'clsx';
	import BoughtShipmentShowModal from '../Modals/BoughtShipmentShowModal.svelte';
	import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';

	export let shipmentAccount: ApiForwardedShipmentAccount;
	export let selectedLocation: number | undefined;
	export let shipmentId: number;

	let showModal = false;

	$: shipmentData = shipmentAccount.account;
	// $: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	// $: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography<string>>;
	// $: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	async function getLocationFromCoords(lat: number, long: number): Promise<string> {
		return `Kraków, Poland`;
	}

	const priority = ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'High':
				return 'text-red-600';
			case 'Medium':
				return 'text-yellow-600';
			case 'Low':
				return 'text-green-600';
			default:
				return 'text-gray-600';
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	on:click
	class={clsx(
		'mt-4 rounded-lg shadow cursor-pointer',
		selectedLocation == shipmentId ? 'bg-secondary-100' : 'bg-white'
	)}
>
	<div class="px-4 py-5 sm:px-6">
		<div class="flex items-center justify-between">
			<h3 class="sm:text-md xl:text-lg leading-6 font-medium text-gray-900">Some title</h3>
			<p
				class="mt-1 text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
			>
				There will be some property instead of price
			</p>
		</div>
		<div class="mt-3 xl:mt-5 flex items-center justify-between">
			<p class="text-xs xl:sm font-medium text-gray-500 mr-6 xl:mr-12">
				<br />
				&#x2022; Priority:
				<span class={clsx('font-semibold', getPriorityColor(priority))}>{priority}</span>
			</p>

			<!-- <button class="text-sm xl:text-md text-accent font-medium" on:click={() => (showModal = true)}
				>Show</button
			> -->
		</div>
	</div>
</li>
<!-- 
{#if selectedLocation === shipmentId && showModal}
	<BoughtShipmentShowModal {shipmentAccount} bind:showModal />
{/if} -->
