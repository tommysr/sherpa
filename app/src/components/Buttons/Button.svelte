<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<button
	class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-b from-primary to-secondary-200 font-bold text-white shadow-2xl duration-1000 ease-out hover:bg-gradient-to-r"
	disabled={$$props.disabled}
	autofocus={$$props.autofocus}
	on:click
>
	{#if $$slots['icon']}
		<slot name="icon" />
	{/if}
	<slot /></button
>
