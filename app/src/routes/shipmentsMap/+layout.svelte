<script lang="ts">
	import { page } from '$app/stores';
	import MapWrapper from '$src/components/ShipmentMap/MapWrapper.svelte';
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';
	import {
		searchableBoughtShipments,
		type SearchableBoughtOrder
	} from '$src/stores/forwarderShipments';
	import type { SearchStore } from '$src/stores/search';
	import { searchableShipments, type SearchableOrder } from '$src/stores/searchableShipments';

	type EitherSearchStore = SearchStore<SearchableOrder> | SearchStore<SearchableBoughtOrder>;

	let storeToSearchIn: EitherSearchStore;

	$: pageUrl = $page.url.pathname;

	$: if (pageUrl == '/shipmentsMap') {
		storeToSearchIn = searchableShipments;
	} else if (pageUrl == '/shipmentsMap/bought') {
		storeToSearchIn = searchableBoughtShipments;
	}
	function handleSearchKeydown(e: KeyboardEvent) {
		if ($storeToSearchIn.searchString && e.key == 'Enter') {
			storeToSearchIn.performSearch();
		} else {
			storeToSearchIn.purgeFiltered();
		}
	}
</script>

<main class="relative h-screen w-full overflow-hidden">
	<div class="absolute z-10 w-3/4 md:w-1/3 xl:w-1/4 left-1/2 transform -translate-x-1/2 top-4">
		<div class="m-3 p-0.5 rounded-full bg-gradient-to-r from-primary to-secondary">
			<label for="name" class="sr-only">Name</label>
			<input
				class="px-3 py-1.5 w-full rounded-full bg-background focus:outline-none text-sm lg:text-md"
				type="text"
				id="name"
				placeholder="Search"
				bind:value={$storeToSearchIn.searchString}
				on:keydown={handleSearchKeydown}
			/>
		</div>
	</div>
	<div class="hidden md:block absolute top-7 right-7 z-40">
		<WalletMultiButton onClose={() => {}} />
	</div>

	<div class="hidden md:block">
		<MapWrapper>
			<slot />
		</MapWrapper>
	</div>

	<div class="md:hidden">
		<MapWrapper>
			<slot />
		</MapWrapper>
	</div>
</main>
