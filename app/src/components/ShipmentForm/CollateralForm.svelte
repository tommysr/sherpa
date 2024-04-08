<script lang="ts">
	import { ValidationMessage, reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';
	import DecimalInput from '../Inputs/DecimalInput.svelte';
	import type { CollateralFormInterface } from './interfaces';
	import { collateralFormSchema as schema } from './schemas';

	export let initialValues: CollateralFormInterface;
	export let onSubmit: any;
	export let onBack: any;
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
		Ship payment
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">
		Enter the amount you want to offer to ship your goods.
	</p>

	<form use:form class="mt-8">
		<span>
			<p class="text-neutral-600 ml-1">Insurance value (collateral):</p>
			<div>
				<DecimalInput name="collateral" placeholder="1 SOL" />

				<ValidationMessage for="collateral" let:messages>
					{#if messages}
						<div class="absolute mt-1 -ml-10" role="alert">
							<p class="text-md text-red-600 font-semibold">{messages[0]}</p>
						</div>
					{/if}
				</ValidationMessage>
			</div>
		</span>

		<div class="mt-6">
			<p class="text-neutral-600 ml-1">Cancelation fee (penalty)</p>
			<div>
				<DecimalInput name="penalty" placeholder="1 SOL" />

				<ValidationMessage for="penalty" let:messages>
					{#if messages}
						<div class="absolute mt-1 -ml-10" role="alert">
							<p class="text-md text-red-600 font-semibold">{messages[0]}</p>
						</div>
					{/if}
				</ValidationMessage>
			</div>
		</div>
		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>
