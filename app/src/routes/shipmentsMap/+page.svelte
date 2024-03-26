<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import { walletStore } from '$stores/wallet';

	$: locationsOnMap = $searchableShipments.filtered.map((s) => s.account.shipment.geography);
	$: isLocationSelected = false;
	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;

	$: if ($walletStore.publicKey) {
		searchableShipments.update((s) => {
			s.filtered = s.data.filter((s) => s.account.shipper !== s.account.owner);

			s.data = s.filtered;

			return s;
		});
	}

	function onElementSelect(i: number) {
		isLocationSelected = true;
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onMarkerClick(i: number) {
		isLocationSelected = true;
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}
</script>

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

<ShipmentsLocations
	locations={locationsOnMap}
	{onMarkerClick}
	{selectedLocation}
	isMobile={false}
/>
