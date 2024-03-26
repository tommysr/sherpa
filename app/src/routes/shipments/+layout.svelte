<script lang="ts">
	import { page } from '$app/stores';
	import CategoryButton from '$src/components/Buttons/CategoryButton.svelte';
	import HotNavigation from '$src/components/Navigation/HotNavigation.svelte';
	import ScrollableMenu from '$src/components/Navigation/ScrollableMenu.svelte';
	import {
		searchableBoughtShipments,
		type SearchableBoughtOrder
	} from '$src/stores/forwarderShipments';
	import type { SearchStore } from '$src/stores/search';
	import { searchableShipments, type SearchableOrder } from '$src/stores/searchableShipments';
	import { anchorStore } from '$src/stores/anchor';
	import type { ApiBoughtShipmentAccount, BoughtShipment } from '$src/utils/idl/boughtShipment';
	import type { ApiShipmentAccount, Shipment } from '$src/utils/idl/shipment';
	import { parseBoughtShipmentToApiBoughtShipment } from '$src/utils/parse/boughtShipment';
	import { parseShipmentToApiShipment } from '$src/utils/parse/shipment';
	import type { PublicKey } from '@solana/web3.js';
	import type BN from 'bn.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	const { program } = get(anchorStore);

	let searchString: string;

	type EitherSearchStore = SearchStore<SearchableOrder> | SearchStore<SearchableBoughtOrder>;

	let currentShipmentsStore: EitherSearchStore = searchableShipments;

	$: {
		switch ($page.url.pathname) {
			case '/shipments':
				$searchableShipments.searchString = searchString;
				currentShipmentsStore = searchableShipments;
				break;
			case '/shipments/bought':
				$searchableBoughtShipments.searchString = searchString;
				currentShipmentsStore = searchableBoughtShipments;
				break;
		}
	}

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

	function handleSearchKeyUp(e: KeyboardEvent) {
		if (searchString && e.key == 'Enter') {
			currentShipmentsStore.performSearch();
		} else if (!searchString) {
			currentShipmentsStore.purgeFiltered();
		}
	}
</script>

<ScrollableMenu>
	{#each categories as category}
		<CategoryButton on:click={() => console.log(`clicked category ${category}`)}
			>{category}</CategoryButton
		>
	{/each}
</ScrollableMenu>

<HotNavigation bind:searchValue={searchString} on:keyup={handleSearchKeyUp} />

<slot />
