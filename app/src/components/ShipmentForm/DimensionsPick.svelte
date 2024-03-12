<script lang="ts">
	export let weightMetrics: string = 'kg';
	export let distanceMetrics: string = 'cm';
	export let weight: number | undefined = undefined;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let depth: number | undefined = undefined;
	export let isMetricTon: boolean = false;
</script>
<h1>Dimensions</h1>
<div class="grid marginb">
	<div class="flex-box">
		<fieldset>
			<label>
				<input name="metricton" type="checkbox" role="switch" required bind:checked={isMetricTon} />
				Metric tons
			</label>
		</fieldset>

		<fieldset>
			<!-- <legend>Weight metrics:</legend> -->
			<h4>Weight metrics</h4>
			<input type="radio" id="kg" name="weight-metrics" bind:group={weightMetrics} value="kg" />
			<label for="kg">kg</label>
			<input type="radio" id="lb" name="weight-metrics" bind:group={weightMetrics} value="lb" />
			<label for="lb">lb</label>
		</fieldset>

		<fieldset>
			<h4>Distance metrics</h4>
			<!-- <legend>Distance metrics:</legend> -->
			<input type="radio" id="cm" name="distance-metrics" bind:group={distanceMetrics} value="cm" />
			<label for="cm">cm</label>
			<input type="radio" id="ft" name="distance-metrics" bind:group={distanceMetrics} value="ft" />
			<label for="ft">ft</label>
		</fieldset>
	</div>

	<div class="flex-box">
		<div>
			<label for="amount">weight</label>

			<input type="number" name="amount" placeholder="weight" required bind:value={weight} />
		</div>
		<!-- TODO: handle input validation, min, max, step and others -->

		{#if isMetricTon}
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
		{/if}
	</div>
</div>

<style lang="scss">
	.flex-box {
		display: flex;
		flex-direction: column;
	}

	fieldset {
		text-align: center;
	}


	h1 {
		text-align: center;
	}

	.marginb {
		margin-bottom: 20px;
	}
</style>
