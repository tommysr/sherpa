<script lang="ts">
	import type { ApiShipmentAccount, ShipmentDimensions } from '$src/utils/account/shipment';
	import type { Entries } from '$src/utils/types/object';
	import clsx from 'clsx';
	import ShipmentShowModal from '../Modals/ShipmentShowModal.svelte';
	import ShipmentInformationModal from '../Modals/ShipmentInformationModal.svelte';
	import { createEventDispatcher } from 'svelte';

	export let shipmentAccount: ApiShipmentAccount;
	export let selectedLocation: number | undefined = undefined;
	export let shipmentId: number;

	$: shipmentData = shipmentAccount.account;
	$: locations = shipmentData.shipment.geography;
	$: priority = getPriorityName(shipmentData.shipment.details.priority);
	$: priorityColor = getPriorityColor(priority);

	const dispatch = createEventDispatcher();

	const handleButtonClick = (e: MouseEvent) => {
		dispatch('buttonClick');
	};

	function getPriorityName(priority: number) {
		switch (priority) {
			case 4:
				return 'High';
			case 3:
				return 'Medium';
			case 2:
				return 'Low';
			default:
				return 'Default';
		}
	}

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
			<h3 class="sm:text-md xl:text-lg leading-6 font-medium text-gray-900">{shipmentData.name}</h3>
			<p
				class="mt-1 text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
			>
				{shipmentData.price / 10 ** 9} SOL
			</p>
		</div>
		<div class="mt-3 xl:mt-5 flex items-center justify-between">
			<p class="text-xs xl:sm font-medium text-gray-500 mr-6 xl:mr-12">
				{locations.fromName + ' → ' + locations.toName}
				<br />
				&#x2022; Priority:
				<span class={clsx('font-semibold', priorityColor)}>{priority}</span>
			</p>

			<button class="text-sm xl:text-md text-accent font-medium" on:click={handleButtonClick}
				>Show</button
			>
		</div>
	</div>
</li>
