<script lang="ts">
	import { userStore } from '$src/stores/user';
	import Input from '../Inputs/Input.svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import type { NameFormInterface } from './interfaces';
	import { nameFormSchema as schema } from './schemas';

	export let initialValues: NameFormInterface;
	export let onSubmit;
	export let onBack;
	export let showModal = true;

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues: { name: initialValues.name },
		validate: (values) => {
			const errors = {
				name: ''
			};

			const { name } = values;

			if (name.length > 64) {
				errors.name = 'Name must be less than 64 characters';
			}

			return errors;
		}
	});
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		{$$restProps['header']}
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">{$$restProps['text']}</p>
	</div>

	<Input name="name" placeholder="enter name to be registered" required />

	<ValidationMessage for="name" let:messages={message}>
		{#if message}
			<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
				<p class="font-bold">Invalid name</p>
				<p>{message || ''}</p>
			</div>
		{/if}
	</ValidationMessage>

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>
