<script lang="ts">
	// Components
	import ScrollableMenu from '$src/components/Navigation/ScrollableMenu.svelte';
	import CategoryButton from '$src/components/Navigation/CategoryButton.svelte';
	import HotNavigation from '$src/components/Navigation/HotNavigation.svelte';
	import OrderCard from '$src/components/Shipment/OrderCard.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';

	import type { PageData } from './$types';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import ShipmentLayout from '$src/components/Shipment/ShipmentLayout.svelte';

	// export let data: PageData;

	// $: shipments = $searchableShipments.data.filter((s) => s.account.owner == s.account.shipper)
	$: locationsOnMap = $searchableShipments.data.map((s) => s.account.shipment.geography);

	// TODO: make it dynamic or from server
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
		if ($searchableShipments.searchString && e.key == 'Enter') {
			searchableShipments.performSearch();
		} else {
			searchableShipments.purgeFiltered();
		}
	}
</script>

<svelte:head><title>Shipments list</title></svelte:head>

<main class="container">
	<!-- <ScrollableMenu>
		{#each categories as category}
			<CategoryButton on:click={() => console.log(`clicked category ${category}`)}
				>{category}</CategoryButton
			>
		{/each}
	</ScrollableMenu> -->

	<HotNavigation
		bind:searchValue={$searchableShipments.searchString}
		on:keydown={handleSearchKeydown}
	/>

	<div class="grid">
		<div class="px-5"> 
			{#if $searchableShipments.filtered.length != 0}
				{#each $searchableShipments.filtered as account}
					<OrderCard shipmentAccount={account} />
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>

		<!-- Map should be fixed or floating, and on mobile in some access menu from the right side, to allow quick preview -->
		<!-- CONSIDER: include filtering, more dynamic -->
		<div class="px-5"><ShipmentsMap locations={locationsOnMap} /></div>
	</div>
</main>

<style lang="scss">
</style>
