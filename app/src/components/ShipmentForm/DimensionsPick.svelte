<script lang="ts">
	import type { ShipmentDimensions } from '$src/utils/account/shipment';
	import DecimalInput from '../Inputs/DecimalInput.svelte';

	export let metrics: {
		weight: string;
		distance: string;
	};

	export let isMetricTon: boolean;
	export let dimensions: ShipmentDimensions;
</script>

<div class="w-full flex flex-col space-y-7">
	<fieldset>
		<label>
			Metric tons
			<input type="checkbox" role="switch" required bind:checked={isMetricTon} />
		</label>
	</fieldset>

	<fieldset>
		<!-- <legend>Weight metrics:</legend> -->
		<h4>Weight metrics</h4>
		<input
			type="radio"
			id="kg"
			name="weight-metrics"
			bind:group={metrics.weight}
			value="kg"
			required
		/>
		<label for="kg">kg</label>
		<input
			type="radio"
			id="lb"
			name="weight-metrics"
			bind:group={metrics.weight}
			value="lb"
			required
		/>
		<label for="lb">lb</label>
	</fieldset>

	{#if !isMetricTon}
		<fieldset>
			<h4>Distance metrics</h4>
			<!-- <legend>Distance metrics:</legend> -->
			<input
				type="radio"
				id="cm"
				name="distance-metrics"
				bind:group={metrics.distance}
				value="cm"
				required
			/>
			<label for="cm">cm</label>
			<input
				type="radio"
				id="ft"
				name="distance-metrics"
				bind:group={metrics.distance}
				value="ft"
				required
			/>
			<label for="ft">ft</label>
		</fieldset>
	{/if}
</div>

<div class="grid grid-cols-3 justify-items-center gap-y-4"></div>
{#if isMetricTon}
	<div
		class="col-span-3 grid grid-cols-2 opacity-100 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">weight</div>
		<div class="">volume</div>
	</div>
	<div>
		<span>
			<DecimalInput placeholder="weight" required bind:value={dimensions.weight} />
		</span>
	</div>
	<div>
		<span> <DecimalInput placeholder="height" required bind:value={dimensions.height} /></span>
	</div>
{/if}

{#if !isMetricTon}
	<div
		class="col-span-3 grid grid-cols-3 opacity-100 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">Width</div>
		<div class="">Height</div>
		<div class="">Depth</div>
	</div>
	<div
		class="col-span-3 grid grid-cols-3 opacity-100 items-center justify-items-center w-full text-white py-2"
	>
		<div>
			<span> <DecimalInput placeholder="width" required bind:value={dimensions.width} /></span>
		</div>
		<div>
			<span> <DecimalInput placeholder="height" required bind:value={dimensions.height} /></span>
		</div>
		<div>
			<span><DecimalInput placeholder="depth" required bind:value={dimensions.depth} /></span>
		</div>
	</div>
{/if}
