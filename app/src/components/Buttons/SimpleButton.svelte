<script lang="ts">
	export let value: string = '';
	export let disabled: boolean = false;

	let className = '';
	export { className as class };

	$: classInside =
		'mx-1 px-4 py-1 text-sm text-white font-semibold bg-orange-400 rounded-md border border-orange-200 hover:text-white hover:bg-orange-600';
</script>

<button class="{classInside} {className}" on:click {disabled}>
	{value}

	<slot />
</button>
