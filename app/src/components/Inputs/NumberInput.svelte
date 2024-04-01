<script lang="ts">
	import clsx from 'clsx';

	export let placeholder: string = '0.00';
	export let value: number | undefined = undefined;
	export let required: boolean = false;
	export let name: string;

	let className: string = '';
	export { className as class };
</script>

<input
	class={clsx(
		'w-full rounded-3xl bg-transparent px-3 py-2 text-sm font-normal placeholder-primary placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base',
		className
	)}
	{name}
	on:keydown
	on:change
	on:input
	on:keyup
	bind:value
	disabled={$$props.disabled}
	type="number"
	{placeholder}
	{required}
/>

<style lang="scss">
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
