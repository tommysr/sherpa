<script lang="ts">
	import { ValidationMessage } from '@felte/reporter-svelte';
	import clsx from 'clsx';

	export let placeholder: string = 'input';
	export let value: string | undefined = undefined;
	export let name: string;
	export let required: boolean = false;

	let className: string = '';
	export { className as class };
</script>

<div class="relative">
	<input
		class={clsx(
			'w-full bg-transparent px-3 py-2 text-sm placeholder-primary placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base rounded-lg border-2 border-gradient-to-r from-primary to-secondary',
			className
		)}
		on:keydown
		on:change
		on:input
		on:keyup
		type="text"
		bind:value
		{name}
		{placeholder}
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
