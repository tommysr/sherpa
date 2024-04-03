<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import Details from './Details.svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import type { DetailsFormInterface } from './interfaces';
	import { detailsFormSchema as schema } from './schemas';

	export let initialValues: DetailsFormInterface;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues,
		validate: (values) => {
			const errors = {
				count: '',
				access: '',
				priority: '',
				fragility: ''
			};

			const { count, access } = values;

			if (count < 1) {
				errors.count = 'count must be higher than zero';
			}

			if (access == '0') {
				errors.access = 'select one of access options';
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

	{#each ['count', 'access', 'priority', 'fragility'] as name}
		<ValidationMessage for={name} let:messages={message}>
			{#if message}
				<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
					<p class="font-bold">Invalid {name}</p>
					<p>{message || ''}</p>
				</div>
			{/if}
		</ValidationMessage>
	{/each}

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>
