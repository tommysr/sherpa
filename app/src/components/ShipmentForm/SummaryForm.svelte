<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import clsx from 'clsx';
	import { createForm } from 'felte';
	import Button from '../Buttons/Button.svelte';
	import type { CreateShipmentFormInterface } from './interfaces';

	let fragilityMap = {
		1: 'Very fragile',
		2: 'Fragile',
		3: 'Normal',
		4: 'Robust',
		5: 'Very robust'
	};

	let priorityMap = {
		1: {
			name: 'Very low',
			color: 'text-green-500'
		},
		2: {
			name: 'Low',
			color: 'text-green-300'
		},
		3: {
			name: 'Medium',
			color: 'text-yellow-300'
		},
		4: {
			name: 'High',
			color: 'text-yellow-500'
		},
		5: {
			name: 'Very high',
			color: 'text-red-500'
		}
	};

	let accessMap = {
		1: 'Only car',
		2: 'Truck up to 10t',
		3: 'Truck over 10t',
		4: 'Something else',
		5: "Can't tell"
	};

	interface UniversalInterface<T> {
		[key: string]: UniversalInterface<T>;
	}

	export let initialValues: CreateShipmentFormInterface;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	// $: console.log(initialValues);

	// $: flatStates = Object.entries(initialValues).flatMap(([key, value]) => {
	// 	return Object.entries(value).map(([nestedKey, nestedValue]) => {
	// 		return { [nestedKey]: nestedValue };
	// 	});
	// });

	// $: console.log(flatStates);

	const { form, data } = createForm({
		extend: [reporter],
		onSubmit
	});
</script>

<div class="text-sm text-neutral-600">
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Summary
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">Confirm creation of shipment.</p>

	<form use:form class="mt-8">
		<div class="w-full flex flex-col space-y-5">
			<div class="grid grid-cols-3 justify-items-center gap-y-4">
				<div
					class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
				>
					<div class="">Username</div>
					<div class="">Shipment name</div>
					<div class="">Count</div>
				</div>

				<div>
					<span>{initialValues.name.name}</span>
				</div>
				<div>
					<span>{initialValues.shipmentName.name}</span>
				</div>
				<div>
					<span>{initialValues.details.count}</span>
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
						{Number(initialValues.price.price)} SOL
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

				<div class="px-3 text-center">
					<span>{new Date(initialValues.dates.when.toString()).toLocaleString()}</span>
				</div>
				<div class="px-3 text-center">
					<span>{new Date(initialValues.dates.deadline.toString()).toLocaleString()}</span>
				</div>

				{#if priorityMap[initialValues.details.priority.toString()]}
					{@const priority = priorityMap[initialValues.details.priority.toString()]}
					<div class="self-center">
						<span class={clsx(priority.color)}>{priority.name}</span>
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-3 justify-items-center gap-y-4">
				<div
					class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
				>
					<div class="col-span-3">Locations</div>
				</div>

				<div class="col-span-3">
					{initialValues.locations?.sourceName + ' → ' + initialValues.locations?.destinationName}
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
					{initialValues.dimensions.weight}
					{initialValues.dimensions.weightMetrics}
				</div>
				<div class="col-span-2">
					{initialValues.dimensions.width} x {initialValues.dimensions.height} x {initialValues.dimensions.depth}
					{initialValues.dimensions.distanceMetrics}
				</div>
			</div>

			<div class="grid grid-cols-2 justify-items-center gap-y-4">
				<div
					class="col-span-2 grid grid-cols-2 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
				>
					<div class="">Fragility</div>
					<div class="">Access</div>
				</div>

				<div>
					<span>{fragilityMap[initialValues.details.fragility.toString()]}</span>
				</div>
				<div>
					<span>{accessMap[initialValues.details.access.toString()]}</span>
				</div>
			</div>
		</div>

		<div class="flex justify-center space-x-5 mt-16">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Finalize</Button>
		</div>
	</form>
</div>
