<script lang="ts">
	import DecimalInput from '../Inputs/DecimalInput.svelte';

	export let metrics: {
		weight: 'kg' | 'lb';
		distance: 'm' | 'ft';
	} = {
		distance: 'm',
		weight: 'kg'
	};

	export let isMetricTon: boolean = false;
</script>

<div class="flex flex-row gap-x-10">
	<div>
		<label>
			Metric tons
			<input name="metric-ton" type="checkbox" bind:checked={isMetricTon} />
		</label>
	</div>

	<div>
		<h4>Weight metrics</h4>
		<input type="radio" name="weight-metrics" bind:group={metrics.weight} value="kg" />
		<label for="kg">kg</label>

		<input type="radio" name="weight-metrics" bind:group={metrics.weight} value="lb" />
		<label for="lb">lb</label>
	</div>

	<div>
		<h4>Distance metrics</h4>
		<input
			type="radio"
			id="m"
			name="distance-metrics"
			bind:group={metrics.distance}
			value="m"
			required
		/>
		<label for="m">m</label>
		<input type="radio" name="distance-metrics" bind:group={metrics.distance} value="ft" required />
		<label for="ft">ft</label>
	</div>
</div>
{#if isMetricTon}
	<div
		class="col-span-2 grid grid-cols-2 opacity-100 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">weight</div>
		<div class="">volume</div>
	</div>
	<div
		class="col-span-2 grid grid-cols-2 opacity-100 items-center justify-items-center w-full text-primary py-2"
	>
		<div>
			<span>
				<DecimalInput name="weight" placeholder="weight" required />
			</span>
		</div>
		<div>
			<span> <DecimalInput name="width" placeholder="volume" required /></span>
		</div>
	</div>
{/if}

{#if !isMetricTon}
	<div
		class="col-span-4 grid grid-cols-4 opacity-100 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">Width</div>
		<div class="">Height</div>
		<div class="">Depth</div>
		<div class="">Weight</div>
	</div>
	<div
		class="col-span-4 grid grid-cols-4 opacity-100 items-center justify-items-center w-full text-primary py-2"
	>
		<div>
			<span> <DecimalInput name="width" placeholder="width" required /></span>
		</div>
		<div>
			<span> <DecimalInput name="height" placeholder="height" required /></span>
		</div>
		<div>
			<span><DecimalInput name="depth" placeholder="depth" required /></span>
		</div>
		<div>
			<span> <DecimalInput name="weight" placeholder="weight" required /></span>
		</div>
	</div>
{/if}
