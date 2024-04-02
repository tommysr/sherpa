<script lang="ts">
	import clsx from 'clsx';

	export let placeholder: string = 'input';
	export let value: string | undefined = undefined;
	export let name: string;
	export let required: boolean = false;

	let className: string = '';
	export { className as class };
</script>

<div class="rounded-lg border-2 border-gradient-to-r from-primary to-secondary">
	<input
		class={clsx(
			'w-full rounded-3xl bg-transparent px-3 py-2 text-sm font-normal placeholder-primary placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base',
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
</div>
