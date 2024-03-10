<script lang="ts">
	import ScrollableMenu from '$src/components/Navigation/ScrollableMenu.svelte';
	import CategoryButton from '$src/components/Navigation/CategoryButton.svelte';
	import HotNavigation from '$src/components/Navigation/HotNavigation.svelte';
	import type { PageData } from './$types';
	import { createSearchStore, type SearchItem } from '$stores/search';
	import OrderCard from '$src/components/Shipment/OrderCard.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';
	import type { ShipmentAccount } from '$src/utils/idl/shipment';

	type SearchableOrder = ShipmentAccount & SearchItem;
	export let data: PageData;

	const searchableOrders: SearchableOrder[] = data.orders.map((order: ShipmentAccount) => {
		return { ...order, searchParams: order.account.shipment.details.priority.toString() };
	});

	// TODO: consider placing in context to avoid creating order stores, when we
	// shouldn't
	const searchStore = createSearchStore(searchableOrders);

	$: locationsOnMap = $searchStore.data.map((s) => s.account.shipment.geography);

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

	function handleSearchKeydown(e: KeyboardEvent) {
		if ($searchStore.searchString && e.key == 'Enter') {
			searchStore.performSearch();
		} else {
			searchStore.purgeFiltered();
		}
	}
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

	<HotNavigation bind:searchValue={$searchStore.searchString} on:keydown={handleSearchKeydown} />

	<div class="grid">
		<div>
			{#if $searchStore.searchState == 'none'}
				{#each $searchStore.data as { account: { shipment } }}
					<OrderCard name="2" date={new Date(shipment.when.toString())} {...shipment.geography} />
				{/each}
			{:else if $searchStore.searchState == 'performed' && $searchStore.filtered.length != 0}
				{#each $searchStore.filtered as { account: { shipment } }}
					<OrderCard name="1" date={new Date(shipment.when.toString())} {...shipment.geography} />
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>
		<!-- Map should be fixed or floating, and on mobile in some access menu from the right side, to allow quick preview -->
		<!-- need to rework it to include filtering -->
		<div><ShipmentsMap locations={locationsOnMap} /></div>
	</div>
</main>

<style lang="scss">
</style>
