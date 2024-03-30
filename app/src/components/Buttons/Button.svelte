<script lang="ts">
	import clsx from 'clsx';

	let className: string = '';
	export { className as class };
</script>

<button
	class={clsx(
		'inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-b from-primary to-secondary-200 font-bold text-white shadow-2xl duration-1000 ease-out hover:bg-gradient-to-r',
		className
	)}
	disabled={$$props.disabled}
	type={$$props.type}
	on:click
>
	{#if $$slots['icon']}
		<slot name="icon" />
	{/if}
	<slot /></button
>
