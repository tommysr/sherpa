<script lang="ts">
	export let count: number = 1;
	export let fragility: number = 2;
	export let priority: number = 3;
	export let access: number = 4;
</script>

<div class="space">
	<label for="amount">Count</label>
	<input
		id="amount"
		name="amount"
		type="number"
		min="1"
		step="1"
		placeholder="1"
		required
		bind:value={count}
	/>
</div>

<label for="priority">Priority</label>
<input
	id="priority"
	name="priority"
	list="priority"
	type="range"
	min="1"
	max="5"
	step="1"
	bind:value={priority}
	required
/>
<datalist id="datalist5values">
	<option value="1">Min</option>
	<option value="2">Low</option>
	<option value="3">Medium</option>
	<option value="4">High</option>
	<option value="5">Max</option>
</datalist>

<label for="fragility">Fragility</label>
<input
	id="fragility"
	name="fragility"
	list="fragilities"
	type="range"
	min="1"
	max="5"
	step="1"
	bind:value={fragility}
	required
/>
<datalist id="datalist5values">
	<option value="1">Min</option>
	<option value="2">Low</option>
	<option value="3">Medium</option>
	<option value="4">High</option>
	<option value="5">Max</option>
</datalist>

<select class="space" name="access"  required bind:value={access}>
	<option selected disabled value=0> Tell how hard is to access source place </option>
	<option value=1>Only car</option>
	<option value=2>Truck up to 10t</option>
	<option value=3>Truck over 10t</option>
	<option value=4>Something else</option>
	<option value=5>Can't tell</option>
</select>

<style lang="scss">
	.space {
		margin-bottom: 20px;
		margin-top: 20px;
	}
</style>
