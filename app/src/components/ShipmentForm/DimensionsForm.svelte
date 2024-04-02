<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import DimensionsPick from './DimensionsPick.svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import { isSeparator } from '$src/utils/utils';
	import type { DimensionsFormInterface } from './interfaces';

	export let initialValues: DimensionsFormInterface;
	export let onSubmit;
	export let onBack;

	export let showModal = true;

	let isMetricTon = initialValues.isMetricTon ?? false;

	const schema = yup.object({
		isMetricTon: yup.boolean().required(),
		weight: yup.string().transform(parseInt).required(),
		volume: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
			return isMetricTon ? schema.transform(parseInt).required() : schema;
		}),
		width: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
			return isMetricTon ? schema : schema.transform(parseInt).required();
		}),
		depth: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
			return isMetricTon ? schema : schema.transform(parseInt).required();
		}),
		height: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
			return isMetricTon ? schema : schema.transform(parseInt).required();
		}),
		distanceMetrics: yup.string().required(),
		weightMetrics: yup.string().required()
	});

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues,

		validate: (values) => {
			const errors = {
				weight: '',
				depth: '',
				width: '',
				height: '',
				volume: ''
			};

			const { depth, weight, width, height, volume, isMetricTon } = values;

			console.log(isMetricTon);
			if (isSeparator(weight)) {
				errors.weight = 'enter correct weight';
			}
			if (width && isSeparator(width)) {
				errors.width = 'enter correct width';
			}
			if (depth && isSeparator(depth)) {
				errors.depth = 'enter correct depth';
			}
			if (height && isSeparator(height)) {
				errors.height = 'enter correct height';
			}
			if (volume && isSeparator(volume)) {
				errors.volume = 'enter correct volume';
			}

			return errors;
		}
	});
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Dimensions
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Enter the dimensions of your shipment</p>
	</div>

	<DimensionsPick bind:isMetricTon />

	{#each ['weight', 'width', 'height', 'depth', 'volume'] as name}
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
