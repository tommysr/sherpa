<script lang="ts">
	export let price: number = 0.01;
</script>

<div class="price">
	<label for="amount">Ship payment in SOL</label>
	<input
		id="amount"
		name="amount"
		type="number"
		min="0.001"
		step="0.001"
		placeholder="0.01"
		required
		bind:value={price}
	/>
</div>

<style lang="scss">
	.price {
		margin-bottom: 20px;
		margin-top: 20px;
	}
</style>
