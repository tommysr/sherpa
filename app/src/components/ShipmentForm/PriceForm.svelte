<script lang="ts">
	import DecimalInput from '../Inputs/DecimalInput.svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import { isSeparator } from '$src/utils/utils';

	export let initialValues;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	const schema = yup.object({
		price: yup.string().transform(parseInt).required()
	});

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues,
		validate: (values) => {
			const errors = {
				price: ''
			};

			const { price } = values;

			if (isSeparator(price) || price == '0') {
				errors.price = 'Price must be greater than zero';
			}

			return errors;
		}
	});
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Ship payment in SOL
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Enter the amount you want to offer to ship your goods</p>
	</div>
	<DecimalInput name="price" placeholder="amount" />

	<ValidationMessage for="price" let:messages={message}>
		{#if message}
			<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
				<p class="font-bold">Invalid price</p>
				<p>{message || ''}</p>
			</div>
		{/if}
	</ValidationMessage>

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>
