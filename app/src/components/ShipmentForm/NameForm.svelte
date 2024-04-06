<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';
	import Input from '../Inputs/Input.svelte';
	import type { NameFormInterface } from './interfaces';
	import { nameFormSchema as schema } from './schemas';

	export let initialValues: NameFormInterface;
	export let onSubmit: any;
	export let onBack: any;
	export let showModal = true;

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues: { name: initialValues.name }
	});
</script>

<div>
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		{$$restProps['header']}
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">
		{$$restProps['text']}
	</p>

	<form use:form class="mt-8">
		<Input name="name" placeholder="Enter name" required />

		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>
