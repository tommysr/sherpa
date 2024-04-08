<script lang="ts">
	import clsx from 'clsx';

	let className: string = '';
	export { className as class };
</script>

<button
	class={clsx(
		'inline-block py-1.5 px-4 text-md text-primary-700 border-b-2 border-white hover:border-primary',
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
