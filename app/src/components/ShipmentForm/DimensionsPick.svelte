<script lang="ts">
	export let weightMetrics: string = 'kg';
	export let distanceMetrics: string = 'cm';
	export let weight: number | undefined = undefined;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let depth: number | undefined = undefined;
</script>

<div class="grid">
	<div>
		<fieldset>
			<legend>Weight metrics:</legend>
			<input type="radio" id="kg" name="weight-metrics" bind:group={weightMetrics} value="kg" />
			<label for="kg">kg</label>
			<input type="radio" id="lb" name="weight-metrics" bind:group={weightMetrics} value="lb" />
			<label for="lb">lb</label>
		</fieldset>
	</div>
	<div>
		<fieldset>
			<legend>Distance metrics:</legend>
			<input type="radio" id="cm" name="distance-metrics" bind:group={distanceMetrics} value="cm" />
			<label for="cm">cm</label>
			<input type="radio" id="ft" name="distance-metrics" bind:group={distanceMetrics} value="ft" />
			<label for="ft">ft</label>
		</fieldset>
	</div>
</div>

<div>
	<label for="amount">weight</label>

	<input type="number" name="amount" placeholder="weight" required bind:value={weight} />
</div>

<!-- TODO: handle input validation, min, max, step and others -->
<div>
	<label for="amount">width</label>

	<input type="number" name="amount" placeholder="width" required bind:value={width} />
</div>

<div>
	<label for="amount"
		>height<label>
			<input type="number" name="amount" placeholder="height" required bind:value={height} />
		</label></label
	>
</div>

<div>
	<label for="amount">Depth</label>
	<input type="number" name="amount" placeholder="depth" required bind:value={depth} />
</div>
