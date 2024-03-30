<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import DimensionsPick from './DimensionsPick.svelte';

	export let initialValues;
	export let onSubmit;
	export let onBack;
	export let showModal = true;

	const { form, data, errors } = createForm({
		extend: reporter,
		onSubmit,
		initialValues
	});
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Dimensions
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Enter the dimensions of your shipment</p>
	</div>

	<DimensionsPick />

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>
