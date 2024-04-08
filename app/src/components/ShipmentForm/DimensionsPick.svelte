<script lang="ts">
	import DecimalInput from '../Inputs/DecimalInput.svelte';

	export let metrics: {
		weight: 'kg' | 'lb';
		distance: 'm' | 'ft';
	} = {
		distance: 'm',
		weight: 'kg'
	};

	export let weight: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let width: number | undefined = undefined;
	export let depth: number | undefined = undefined;
	export let volume: number | undefined = undefined;

	export let isMetricTon: boolean = false;
</script>

<div class="flex justify-around mb-8">
	<div class="flex flex-col justify-start items-center">
		<h4 class="text-neutral-600 text-sm mb-2">Metric tons</h4>
		<input
			name="isMetricTon"
			type="checkbox"
			class="w-4 h-4 bg-gray-100 border-gray-300 rounded"
			bind:checked={isMetricTon}
		/>
	</div>

	<div class="flex flex-col justify-start items-center">
		<h4 class="text-neutral-600 text-sm mb-2">Weight metrics</h4>

		<div class="flex space-x-4">
			<div class="flex items-center">
				<input
					type="radio"
					name="weightMetrics"
					class="w-4 h-4 text-primary bg-gray-100 border-gray-300"
					bind:group={metrics.weight}
					value="kg"
				/>
				<label for="kg" class="ms-1 text-sm text-gray-900">Kg</label>
			</div>
			<div class="flex items-center">
				<input
					type="radio"
					name="weightMetrics"
					class="w-4 h-4 text-primary bg-gray-100 border-gray-300"
					bind:group={metrics.weight}
					value="lb"
				/>
				<label for="lb" class="ms-1 text-sm text-gray-900">Lb</label>
			</div>
		</div>
	</div>

	<div class="flex flex-col justify-start items-center">
		<h4 class="text-neutral-600 text-sm mb-2">Distance metrics</h4>

		<div class="flex space-x-4">
			<div class="flex items-center">
				<input
					type="radio"
					name="distanceMetrics"
					bind:group={metrics.distance}
					value="m"
					required
					class="w-4 h-4 text-primary bg-gray-100 border-gray-300"
				/>
				<label for="m" class="ms-1 text-sm text-gray-900">M</label>
			</div>
			<div class="flex items-center">
				<input
					type="radio"
					name="distanceMetrics"
					class="w-4 h-4 text-primary bg-gray-100 border-gray-300"
					bind:group={metrics.distance}
					value="ft"
				/>
				<label for="ft" class="ms-1 text-sm text-gray-900">Ft</label>
			</div>
		</div>
	</div>
</div>

{#if isMetricTon}
	<div
		class="grid grid-cols-2 gap-3 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">Weight</div>
		<div class="">Volume</div>
	</div>
	<div
		class="grid grid-cols-2 gap-3 opacity-100 items-center justify-items-center w-full text-primary py-2"
	>
		<div>
			<span>
				<DecimalInput bind:value={weight} name="weight" placeholder="weight" required />
			</span>
		</div>
		<div>
			<span> <DecimalInput bind:value={volume} name="volume" placeholder="volume" required /></span>
		</div>
	</div>
{/if}

{#if !isMetricTon}
	<div
		class="grid grid-cols-4 gap-3 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">Width</div>
		<div class="">Height</div>
		<div class="">Length</div>
		<div class="">Weight</div>
	</div>
	<div class="grid grid-cols-4 gap-3 items-center justify-items-center w-full text-primary py-2">
		<div>
			<span>
				<DecimalInput
					data-felte-keep-on-remove
					bind:value={width}
					name="width"
					placeholder="width"
					required
				/></span
			>
		</div>
		<div>
			<span>
				<DecimalInput
					data-felte-keep-on-remove
					bind:value={height}
					name="height"
					placeholder="height"
					required
				/></span
			>
		</div>
		<div>
			<span
				><DecimalInput
					data-felte-keep-on-remove
					bind:value={depth}
					name="length"
					placeholder="length"
					required
				/></span
			>
		</div>
		<div>
			<span>
				<DecimalInput
					data-felte-keep-on-remove
					bind:value={weight}
					name="weight"
					placeholder="weight"
					required
				/></span
			>
		</div>
	</div>
{/if}
