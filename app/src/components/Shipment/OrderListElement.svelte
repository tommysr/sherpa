<script lang="ts">
	import type {
		ApiShipmentAccount,
		Geography,
		ShipmentDetails,
		ShipmentDimensions
	} from '$src/utils/idl/shipment';
	import type { Entries } from '$src/utils/types/object';
	import clsx from 'clsx';

	export let shipmentAccount: ApiShipmentAccount;
	export let selectedLocation: number | undefined;
	export let shipmentId: number;

	$: shipmentData = shipmentAccount.account;
	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	$: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

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
		selectedLocation == shipmentId ? 'bg-secondary-100' : 'bg-white'
	)}
>
	<div class="px-4 py-5 sm:px-6">
		<div class="flex items-center justify-between">
			<h3 class="text-lg leading-6 font-medium text-gray-900">Item 1</h3>
			<p class="mt-1 max-w-2xl text-sm text-gray-500">Description for Item 1</p>
		</div>
		<div class="mt-4 flex items-center justify-between">
			<p class="text-sm font-medium text-gray-500">
				Status: <span class="text-green-600">Active</span>
			</p>
			<a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Edit</a>
		</div>
	</div>
</li>
