<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import { createForm } from 'felte';
	import Button from '../Buttons/Button.svelte';
	import SummaryWrapper from '../SummaryWrapper.svelte';
	import type { CreateShipmentFormInterface } from './interfaces';

	export let onSubmit;
	export let onBack;
	export let showModal = true;
	export let initialValues: CreateShipmentFormInterface;

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
		<SummaryWrapper shipment={initialValues} />

		<div class="flex justify-center space-x-5 mt-14">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Finalize</Button>
		</div>
	</form>
</div>
