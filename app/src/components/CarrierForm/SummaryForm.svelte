<script lang="ts">
	import { reporter } from '@felte/reporter-svelte';
	import { createForm } from 'felte';
	import Button from '../Buttons/Button.svelte';

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

<div class="text-sm text-neutral-600">
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Summary
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">Confirm carrier creation.</p>

	<form use:form class="mt-12">
		<div class="w-full flex flex-col space-y-5">
			<div class="grid grid-cols-3 justify-items-center gap-y-4">
				<div
					class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
				>
					<div class="col-span-3">Name</div>
				</div>

				<div class="col-span-3 px-3 text-center">
					<span>{flatStates[0].name}</span>
				</div>
			</div>

			<div class="grid grid-cols-3 justify-items-center gap-y-4">
				<div
					class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
				>
					<div class="col-span-3">Date</div>
				</div>

				<div class="col-span-3 px-3 text-center">
					<span>{new Date(flatStates[1].when.toString()).toLocaleString()}</span>
				</div>
			</div>

			<div class="grid grid-cols-3 justify-items-center gap-y-4">
				<div
					class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
				>
					<div class="col-span-3">Location</div>
				</div>

				<div class="col-span-3 px-3 text-center">
					<span>{flatStates[4].name}</span>
				</div>
			</div>
		</div>

		<div class="flex justify-center space-x-5 mt-14">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Finalize</Button>
		</div>
	</form>
</div>
