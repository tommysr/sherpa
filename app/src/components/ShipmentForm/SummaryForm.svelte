<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import Details from './Details.svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import type { CreateShipmentFormInterface } from './interfaces';

	//export let flatStates: { [key: string]: string }[];

	interface UniversalInterface<T> {
		[key: string]: UniversalInterface<T>;
	}

	export let initialValues: UniversalInterface<string | Date | number>;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	$: flatStates = Object.entries(initialValues).flatMap(([key, value]) => {
		return Object.entries(value).map(([nestedKey, nestedValue]) => {
			return { [nestedKey]: nestedValue };
		});
	});

	const { form, data } = createForm({
		extend: [reporter],
		onSubmit
	});
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Summary
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Confirm creation of shipment</p>
	</div>

	<div>
		{#each flatStates as item}
			<div class="grid grid-cols-2 px-4 py-2 border">
				{#each Object.entries(item) as [key, value]}
					<div>{key}</div>
					<div>{value}</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Finalize</Button>
	</div>
</form>
