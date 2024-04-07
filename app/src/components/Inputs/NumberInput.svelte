<script lang="ts">
	import clsx from 'clsx';

	export let placeholder: string = '0.00';
	export let value: number | undefined = undefined;
	export let required: boolean = false;
	export let name: string;

	let className: string = '';
	export { className as class };
</script>

<div class="rounded-lg border-2 border-gradient-to-r from-primary to-secondary">
	<input
		class={clsx(
			className,
			'rounded-3xl bg-transparent px-3 py-2 text-sm font-normal placeholder-primary placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base'
		)}
		{name}
		autocomplete="off"
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
</div>
