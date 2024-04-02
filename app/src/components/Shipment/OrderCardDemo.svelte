<script lang="ts">
	import type {
		ApiShipmentAccount,
		Geography,
		ShipmentDetails,
		ShipmentDimensions
	} from '$src/utils/account/shipment';
	import type { Entries } from '$src/utils/types/object';

	export let shipmentAccount: ApiShipmentAccount;

	$: shipmentData = shipmentAccount.account;
	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = shipmentData.shipment.geography;
	// $: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	async function getLocationFromCoords(lat: number, long: number): Promise<string> {
		return `Kraków, Poland`;
	}
</script>

<div class="w-full flex flex-col space-y-7">
	<div class="my-10 flex justify-center">
		<h2
			class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
		>
			{shipmentData.price / 10 ** 9} SOL
		</h2>
	</div>

	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="">When</div>
			<div class="">Deadline</div>
			<div class="">Priority</div>
		</div>

		<div>
			<span>{new Date(shipmentData.shipment.when).toLocaleDateString()}</span>
		</div>
		<div>
			<span>{new Date(shipmentData.shipment.deadline).toLocaleDateString()}</span>
		</div>
		<div>
			<span>High</span>
		</div>
	</div>

	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="col-span-3">Locations</div>
		</div>

		<div class="col-span-3">
			<p class="text-xs xl:sm font-medium text-gray-500 mr-6 xl:mr-12">
				{locations.fromName + ' → ' + locations.toName}
			</p>
		</div>
	</div>

	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div>Weight</div>
			<div class="col-span-2">Depth x Height x Width</div>
		</div>

		<div>
			{#if dimensions}
				{dimensions[3][1]} kg
			{:else}
				<p>No dimensions</p>
			{/if}
		</div>
		<div class="col-span-2">
			{#if dimensions}
				{dimensions[0][1]} x {dimensions[1][1]} x {dimensions[2][1]} cm
			{:else}
				<p>No dimensions</p>
			{/if}
		</div>
	</div>
</div>
