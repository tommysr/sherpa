<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import Details from './Details.svelte';

	export let initialValues;
	export let onSubmit;
	export let onBack;
	export let showModal = true;

	const { form, data } = createForm({
		extend: reporter,
		onSubmit,
		initialValues,
		validate: (values) => {
			const errors = {
				details: ''
			};

			const { count, access } = values;

			if (typeof count == 'number') {
				if (count < 1) {
					errors.details = 'count must be higher than zero';
				}
			} else {
				errors.details = 'invalid form fields';
			}

			if (typeof access == 'string') {
				const parsed = parseInt(access);

				if (parsed < 1) {
					errors.details = 'select one of access options';
				}
			} else {
				errors.details = 'invalid form fields';
			}

			return errors;
		}
	});
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Details
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Enter details of your shipment</p>
	</div>

	<Details />

	<ValidationMessage for="details" let:messages={message}>
		{#if message}
			<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
				<p class="font-bold">Invalid details</p>
				<p>{message || ''}</p>
			</div>
		{/if}
	</ValidationMessage>

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>
