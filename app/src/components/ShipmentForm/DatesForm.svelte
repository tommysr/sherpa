<script lang="ts">
	import { ValidationMessage, reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { DateInput } from 'date-picker-svelte';
	import { createForm } from 'felte';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';
	import type { DatesFormInterface } from './interfaces';
	import { dateFormSchema as schema } from './schemas';

	export let initialValues: DatesFormInterface;
	export let onSubmit: any;
	export let onBack: any;
	export const showModal = true;

	const { form, data, touched } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues
	});

	const deadlineInitial = $data.deadline;
	const whenInitial = $data.when;

	$: {
		if (deadlineInitial !== $data.deadline) {
			$touched.deadline = true;
		}

		if (whenInitial !== $data.when) {
			$touched.when = true;
		}
	}
</script>

<div>
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Deadline
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">
		Enter the desired date and deadline date of your shipment.
	</p>

	<form use:form class="mt-8 px-4">
		<span class="flex items-center justify-between">
			<p class="text-neutral-600">Deadline of the shipment:</p>
			<div>
				<DateInput
					format="yyyy/MM/dd HH:mm"
					placeholder="2000/31/12 23:59"
					required
					timePrecision="minute"
					bind:value={$data.deadline}
				/>

				<ValidationMessage for="deadline" let:messages>
					{#if messages}
						<div class="absolute mt-1 -ml-10" role="alert">
							<p class="text-md text-red-600 font-semibold">{messages[0]}</p>
						</div>
					{/if}
				</ValidationMessage>
			</div>
		</span>

		<span class="flex items-center justify-between mt-5">
			<p class="text-neutral-600">Desired date of the shipment:</p>
			<div>
				<DateInput
					format="yyyy/MM/dd HH:mm"
					placeholder="2000/31/12 23:59"
					timePrecision="minute"
					required
					bind:value={$data.when}
				/>

				<ValidationMessage for="when" let:messages>
					{#if messages}
						<div class="absolute mt-1 -ml-10" role="alert">
							<p class="text-md text-red-600 font-semibold">{messages[0]}</p>
						</div>
					{/if}
				</ValidationMessage>
			</div>
		</span>

		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>
