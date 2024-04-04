<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';
	import DecimalInput from '../Inputs/DecimalInput.svelte';
	import type { PriceFormInterface } from './interfaces';
	import { priceFormSchema as schema } from './schemas';

	export let initialValues: PriceFormInterface;
	export let onSubmit: any;
	export let onBack: any;
	export const showModal = true;

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
		Ship payment
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">
		Enter the amount you want to offer to ship your goods.
	</p>

	<form use:form class="mt-8">
		<DecimalInput name="price" placeholder="1 SOL" />

		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>
