<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';
	import { searchableShipments } from '$src/stores/searchableShipments';

	$: locationsOnMap = $searchableShipments.data.map((s) => s.account.shipment.geography);

	$: isLocationSelected = false;
	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;

	function onMarkerClick(i: number) {
		isLocationSelected = true;
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onElementSelect(i: number) {
		isLocationSelected = true;
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
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
			/>
		</div>
	</div>
	<div class="hidden md:block absolute top-7 right-7 z-40">
		<WalletMultiButton onClose={() => {}} />
	</div>

	<LayoutListWrapper bind:isMobileOpen>
		{#if $searchableShipments.filtered.length != 0}
			<ul>
				{#each $searchableShipments.filtered as account, i}
					<OrderListElement
						on:click={() => onElementSelect(i)}
						shipmentAccount={account}
						{selectedLocation}
						shipmentId={i}
					/>
				{/each}
			</ul>
		{:else}
			<p>Nothing found</p>
		{/if}
	</LayoutListWrapper>

	<div class="hidden md:block">
		<ShipmentsMap locations={locationsOnMap} {onMarkerClick} {selectedLocation} isMobile={false} />
	</div>

	<div class="md:hidden">
		<ShipmentsMap locations={locationsOnMap} {onMarkerClick} {selectedLocation} isMobile={true} />
	</div>
</main>
