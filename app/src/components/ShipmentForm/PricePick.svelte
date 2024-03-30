<script lang="ts">
	import DecimalInput from '../Inputs/DecimalInput.svelte';

	export let price: number;
</script>

<div class="price">
	<div class="my-10 flex justify-center">
		<h2
			class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
		>
			Ship payment in SOL
		</h2>
	</div>
	<DecimalInput bind:value={price} placeholder="amount" />
</div>
