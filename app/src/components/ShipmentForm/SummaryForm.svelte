<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import { createForm } from 'felte';
	import Button from '../Buttons/Button.svelte';
	import SummaryWrapper from '../SummaryWrapper.svelte';
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
			color: 'text-orange-400'
		},
		4: {
			name: 'High',
			color: 'text-red-500'
		},
		5: {
			name: 'Very high',
			color: 'text-red-800'
		}
	};

	let accessMap = {
		1: 'Only car',
		2: 'Truck up to 10t',
		3: 'Truck over 10t',
		4: 'Something else',
		5: "Can't tell"
	};

	export let onSubmit;
	export let onBack;
	export let showModal = true;
	export let initialValues: CreateShipmentFormInterface;

	const { form, data } = createForm({
		extend: [reporter],
		onSubmit
	});

	$: console.log(initialValues);
</script>

<div class="text-sm text-neutral-600">
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Summary
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">Confirm creation of shipment.</p>

	<form use:form class="mt-8">
		<SummaryWrapper shipment={initialValues} />

		<div class="flex justify-center space-x-5 mt-14">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Finalize</Button>
		</div>
	</form>
</div>
