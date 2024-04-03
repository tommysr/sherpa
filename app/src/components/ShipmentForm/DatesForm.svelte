<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import { DateInput } from 'date-picker-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import type { DatesFormInterface } from './interfaces';
	import { dateFormSchema as schema } from './schemas';

	export let initialValues: DatesFormInterface;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	const { form, data, touched } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues,
		validate: (values) => {
			const errors = {
				when: '',
				deadline: ''
			};

			const { deadline, when } = values;

			if (deadline < new Date()) {
				errors.deadline = 'deadline should be in the future';
			}

			if (when < new Date()) {
				errors.when = 'date should be in the future';
			}

			return errors;
		}
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

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Dates
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Enter the desired date and deadline date of your shipment</p>
	</div>

	<div class="flex flex-col items-center gap-y-2">
		<span>
			Deadline of the shipment:
			<DateInput
				format="yyyy/MM/dd HH:mm"
				placeholder="2000/31/12 23:59"
				required
				timePrecision="minute"
				bind:value={$data.deadline}
			/>
		</span>

		<span>
			Desired date of the shipment:
			<DateInput
				format="yyyy/MM/dd HH:mm"
				placeholder="2000/31/12 23:59"
				timePrecision="minute"
				required
				bind:value={$data.when}
			/>
		</span>
	</div>

	<ValidationMessage for="deadline" let:messages={message}>
		{#if message}
			<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
				<p class="font-bold">Invalid deadline</p>
				<p>{message || ''}</p>
			</div>
		{/if}
	</ValidationMessage>

	<ValidationMessage for="when" let:messages={message}>
		{#if message}
			<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
				<p class="font-bold">Invalid date</p>
				<p>{message || ''}</p>
			</div>
		{/if}
	</ValidationMessage>

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>
