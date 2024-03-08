<script lang="ts">
	import type { MockTransportOrder } from '$src/utils/types/mockTransport';
	import image from '$lib/images/logo.png';
	import ShipmentMap from '$components/ShipmentMap/ShipmentMap.svelte';
	import ScrollableMenu from '$src/components/Navigation/ScrollableMenu.svelte';
	import CategoryButton from '$src/components/Navigation/CategoryButton.svelte';
	import HotNavigation from '$src/components/Navigation/HotNavigation.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;
	$: orders = data.orders as MockTransportOrder[];

	// TODO: make it dynamic?
	const categories: string[] = [
		'Normal',
		'Big',
		'Small',
		'Freeze',
		'Fragile',
		'Perishable',
		'Heavy',
		'Hazardous',
		'Oversized',
		'Express',
		'International',
		'Domestic',
		'Bulk',
		'Liquid',
		'Sensitive',
		'Valuable',
		'High Priority',
		'Documents',
		'Live Animals',
		'Electronics'
	];

	// TODO: some card changes when priority is high would be nice idea
	// given that higher priority could mean greater price
	// function getClassNameFromPriority(priority: number) {
	// 	if (priority < 2) {
	// 		return 'normal';
	// 	} else if (priority < 5) {
	// 		return 'low';
	// 	} else if (priority < 8) {
	// 		return 'medium';
	// 	} else {
	// 		return 'high';
	// 	}
	// }
</script>

<svelte:head><title>Orders</title></svelte:head>

<main class="container">
	<ScrollableMenu>
		{#each categories as category}
			<CategoryButton on:click={() => console.log(`clicked category ${category}`)}
				>{category}</CategoryButton
			>
		{/each}
	</ScrollableMenu>

	<HotNavigation />

	<div class="grid">
		<div>
			{#each orders as order}
				<div class="card">
					<article>
						<header>Name of the thing to transport</header>
						<div class="grid">
							<div>
								<img alt="img" src={image} />
							</div>
							<div>
								Volume: {order.dimensions.volume.toFixed(2)}
								Weight: {order.dimensions.weight.toFixed(2)}
								Fragile: {order.details.fragility.toFixed(0)}
							</div>
							<div>Location: Krakow</div>
						</div>
					</article>
					<article>
						<details>
							<summary>Precise location</summary>
							<ul>
								<li>Source: {Object.values(order.from)}</li>
								<li>Destination: {Object.values(order.to)}</li>
							</ul>
						</details>
						<details>
							<summary>Other informations</summary>
							<ul>
								<li>Source: {Object.values(order.from)}</li>
								<li>Destination: {Object.values(order.to)}</li>
							</ul>
						</details>

						<footer>Date of shipment: {new Date(order.when).toDateString()}</footer>
					</article>
				</div>
			{/each}
		</div>
		<!-- Map should be fixed or floating, and on mobile in some access menu from the right side, to allow quick preview -->
		<div><ShipmentMap /></div>
	</div>
</main>

<style lang="scss">
	.card {
		padding: 10px;
		margin-bottom: 20px;
	}
</style>
