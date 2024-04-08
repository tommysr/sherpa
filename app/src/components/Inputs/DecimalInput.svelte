<script lang="ts">
	import { ValidationMessage } from '@felte/reporter-svelte';
	import clsx from 'clsx';

	export let placeholder: string = '0.00';
	export let value: number | undefined = undefined;
	export let required: boolean = false;
	export let name: string;

	let className: string = '';
	export { className as class };

	function onKeyDown(event: KeyboardEvent) {
		const key = event.key;

		const isNumeric = /^[0-9]$/.test(key);
		const isDecimalSeparator = key === '.' || key === ',';
		const isBackspace = key === 'Backspace';

		if (!(isNumeric || isDecimalSeparator || isBackspace)) {
			event.preventDefault();
		}

		// Allow only one decimal separator
		if (
			isDecimalSeparator &&
			(value?.toString().includes('.') || value?.toString().includes(','))
		) {
			event.preventDefault();
		}
	}
</script>

<div class="rounded-lg border-2 border-gradient-to-r from-primary to-secondary">
	<input
		class={clsx(
			'w-full rounded-3xl bg-transparent px-3 py-2 text-sm text-neutral-600 font-normal placeholder-primary placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base',
			className
		)}
		{name}
		autocomplete="off"
		on:keydown={onKeyDown}
		on:change
		on:input
		on:keyup
		disabled={$$props.disabled}
		type="text"
		bind:value
		{placeholder}
		pattern="^[0-9]*[.,]?[0-9]$"
		{required}
	/>

	<ValidationMessage for={name} let:messages>
		{#if messages}
			<div class="absolute ml-3 mt-1" role="alert">
				<p class="text-md text-red-600 font-semibold">{messages[0]}</p>
			</div>
		{/if}
	</ValidationMessage>
</div>
