<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';
	import DimensionsPick from './DimensionsPick.svelte';
	import type { DimensionsFormInterface } from './interfaces';
	import { dimensionsFormSchema as schema } from './schemas';

	export let initialValues: DimensionsFormInterface;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	let isMetricTon = initialValues.isMetricTon ?? false;

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues
	});
</script>

<div>
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Dimensions
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">Enter the dimensions of your shipment.</p>

	<form use:form class="mt-8">
		<DimensionsPick bind:isMetricTon />

		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>
