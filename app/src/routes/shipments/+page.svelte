<script lang="ts">
	import HotNavigation from '$src/components/Navigation/HotNavigation.svelte';
	import OrderCard from '$src/components/Shipment/OrderCard.svelte';

	import { searchableShipments } from '$src/stores/searchableShipments';
	import { walletStore } from '$src/stores/wallet';
	import type { PageData } from './$types';

	export let data: PageData;

	$: if ($walletStore.publicKey) {
		searchableShipments.update((s) => {
			s.filtered = s.data.filter((s) => s.account.shipper !== s.account.owner);

			s.data = s.filtered;

			return s;
		});
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if ($searchableShipments.searchString && e.key == 'Enter') {
			searchableShipments.performSearch();
		} else {
			searchableShipments.purgeFiltered();
		}
	}
</script>

<svelte:head><title>Shipments list</title></svelte:head>

<main class="container mx-auto grid grid-col-1 lg:grid-cols-2 gap-10 px-5 lg:px-20">
	<!-- <ScrollableMenu>
		{#each categories as category}
			<CategoryButton on:click={() => console.log(`clicked category ${category}`)}
				>{category}</CategoryButton
			>
		{/each}
	</ScrollableMenu> -->

	<div class="lg:col-span-2 w-full border-b-2 border-t-2 border-primary-200 mt-10 py-4">
		<HotNavigation
			bind:searchValue={$searchableShipments.searchString}
			on:keyup={handleSearchKeydown}
		/>
	</div>

	<div class="lg:pr-10">
		{#if $searchableShipments.filtered.length != 0}
			{#each $searchableShipments.filtered as account}
				<OrderCard shipmentAccount={account} />
				<hr class="col-span-2" />
			{/each}
		{:else}
			<p>Nothing found</p>
		{/if}
	</div>

	<!-- <div class="hidden lg:block">
		<div class="p-5 bg-primary-200 rounded-lg"><ShipmentsMap locations={locationsOnMap} /></div>
	</div> -->
	<!-- Map should be fixed or floating, and on mobile in some access menu from the right side, to allow quick preview -->
	<!-- CONSIDER: include filtering, more dynamic -->
</main>
