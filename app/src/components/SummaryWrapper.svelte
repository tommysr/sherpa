<script lang="ts">
	import { userStore } from '$src/stores/user';
	import clsx from 'clsx';
	import { get } from 'svelte/store';
	import type { CreateShipmentFormInterface } from './ShipmentForm/interfaces';

	let fragilityMap = {
		1: 'Very fragile',
		2: 'Fragile',
		3: 'Normal',
		4: 'Robust',
		5: 'Very robust'
	};

	let accessMap = {
		1: 'Only car',
		2: 'Truck up to 10t',
		3: 'Truck over 10t',
		4: 'Something else',
		5: "Can't tell"
	};

	const getPriorityName = (priority: number) => {
		switch (priority) {
			case 5:
				return {
					name: 'Very high',
					color: 'text-red-800'
				};
			case 4:
				return {
					name: 'High',
					color: 'text-red-500'
				};
			case 3:
				return {
					name: 'Medium',
					color: 'text-orange-400'
				};
			case 2:
				return {
					name: 'Low',
					color: 'text-green-300'
				};
			case 1:
				return {
					name: 'Very low',
					color: 'text-green-500'
				};
			default:
				return {
					name: 'Unknown',
					color: 'text-gray-600'
				};
		}
	};

	export let shipment: CreateShipmentFormInterface;

	const { shipper } = get(userStore);
</script>

<div class="w-full flex flex-col text-xs xl:text-sm space-y-3 xl:space-y-5 text-neutral-600">
	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="">Owner</div>
			<div class="">Shipment name</div>
			<div class="">Count</div>
		</div>

		<div>
			<span>{shipment.name.name.toString().length > 0 ? shipment.name.name : shipper.name}</span>
		</div>
		<div>
			<span>{shipment.shipmentName.name}</span>
		</div>
		<div>
			<span>{shipment.details.count}</span>
		</div>
	</div>

	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="col-span-3">Price</div>
		</div>

		<div class="col-span-3">
			<h2
				class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
			>
				{Number(shipment.price.price)} SOL
			</h2>
		</div>
	</div>

	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="">When</div>
			<div class="">Deadline</div>
			<div class="">Priority</div>
		</div>

		<div class="px-4 text-center">
			<span>{shipment.dates.when.toLocaleString()}</span>
		</div>
		<div class="px-4 text-center">
			<span>{shipment.dates.deadline.toLocaleString()}</span>
		</div>

		<div class="self-center">
			<span class={clsx(getPriorityName(shipment.details.priority).color)}
				>{getPriorityName(shipment.details.priority).name}</span
			>
		</div>
	</div>

	<div class="grid grid-cols-3 justify-items-center gap-y-4">
		<div
			class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="col-span-3">Locations</div>
		</div>

		<div class="col-span-3 flex items-center space-x-2 px-1">
			<p class="text-center">{shipment.locations.sourceName}</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-arrow-right"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
				/>
			</svg>
			<p class="text-center">{shipment.locations.destinationName}</p>
		</div>
	</div>

	{#if shipment.dimensions.isMetricTon}
		<div class="grid grid-cols-2 justify-items-center gap-y-4">
			<div
				class="col-span-2 grid grid-cols-2 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
			>
				<div>Weight</div>
				<div>Volume</div>
			</div>

			<div>
				{shipment.dimensions.weight}
				{shipment.dimensions.weightMetrics}
			</div>
			<div>
				{shipment.dimensions.volume}
				{shipment.dimensions.distanceMetrics}<sup>3</sup>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-3 justify-items-center gap-y-4">
			<div
				class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
			>
				<div>Weight</div>
				<div class="col-span-2">Depth x Height x Width</div>
			</div>

			<div class="self-center">
				{shipment.dimensions.weight}
				{shipment.dimensions.weightMetrics}
			</div>
			<div class="col-span-2">
				{shipment.dimensions.width} x {shipment.dimensions.height} x {shipment.dimensions.depth}
				{shipment.dimensions.distanceMetrics}
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-2 justify-items-center gap-y-4">
		<div
			class="col-span-2 grid grid-cols-2 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
		>
			<div class="">Fragility</div>
			<div class="">Access</div>
		</div>

		<div>
			<span>{fragilityMap[shipment.details.fragility.toString()]}</span>
		</div>
		<div>
			<span>{accessMap[shipment.details.access.toString()]}</span>
		</div>
	</div>
</div>
