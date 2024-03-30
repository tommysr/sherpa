<script lang="ts">
	import Details from './Details.svelte';
	import DimensionsPick from './DimensionsPick.svelte';
	import PricePick from './PricePick.svelte';
	import { userStore } from '$src/stores/user';
	import { onMount } from 'svelte';
	import { FormStages, formStore } from '$src/stores/orderForm';

	onMount(() => {
		formStore.refresh();
	});
</script>

<div class="w-full flex flex-col space-y-7 mt-10">
	{#if $formStore.currentStage == FormStages.Name}
		<p class="text-sm lg:text-md">
			You are not registered as a shipper. Please enter your name to be registered.
		</p>

		<input
			class="w-full p-4 rounded-xl border border-primary-200 mt-4"
			type="text"
			bind:value={$userStore.shipper.name}
			placeholder="enter name to be registered"
			minlength="1"
			maxlength="64"
			required
		/>
	{:else if $formStore.currentStage == FormStages.Price}
		<PricePick bind:price={$formStore.price} />
	{:else if $formStore.currentStage == FormStages.Dimensions}
		<DimensionsPick
			bind:isMetricTon={$formStore.isMetricTon}
			bind:dimensions={$formStore.dimensions}
			bind:metrics={$formStore.metrics}
		/>
	{:else if $formStore.currentStage == FormStages.Details}
		<Details bind:details={$formStore.details} />
	{/if}
</div>
