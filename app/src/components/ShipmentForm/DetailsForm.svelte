<script lang="ts">
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';
	import Details from './Details.svelte';
	import type { DetailsFormInterface } from './interfaces';
	import { detailsFormSchema as schema } from './schemas';

	export let initialValues: DetailsFormInterface;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema, castValues: true })],
		onSubmit,
		initialValues
	});
</script>

<div>
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Details
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">Enter details of your shipment.</p>

	<form use:form class="mt-8">
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

		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>
