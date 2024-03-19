<script lang="ts">
	export let disabled: boolean = false;
</script>

<button class="mx-1 px-1 text-sm text-orange-600 font-semibold rounded-xl border border-orange-200 hover:text-white hover:bg-orange-600" on:click {disabled}> <slot /></button>
