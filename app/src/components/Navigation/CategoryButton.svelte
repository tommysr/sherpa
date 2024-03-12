<script lang="ts">
	export let disabled: boolean = false;
</script>

<button on:click {disabled}> <slot /></button>
