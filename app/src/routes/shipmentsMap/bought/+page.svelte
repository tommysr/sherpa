<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import BoughtOrderListElement from '$src/components/Shipment/BoughtOrderListElement.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { searchableBoughtShipments } from '$src/stores/forwarderShipments';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import { walletStore } from '$stores/wallet';

	$: if ($walletStore.publicKey) {
		searchableBoughtShipments.update((s) => {
			s.filtered = s.data.filter((s) => s.account.buyer === $walletStore.publicKey?.toString());

			s.data = s.filtered;

			return s;
		});
	}

	$: locationsOnMap = $searchableBoughtShipments.data.map((s) => s.account.shipment.geography);
	$: isLocationSelected = false;
	$: isWalletConnected = $walletStore.publicKey != null;

	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;

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
	{#if !isWalletConnected}
		<p
			class="mt-1 text-center text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
		>
			Please connect your wallet to view bought shipments
		</p>
	{:else if $searchableBoughtShipments.filtered.length != 0}
		<ul>
			{#each $searchableBoughtShipments.filtered as account, i}
				<BoughtOrderListElement
					on:click={() => onElementSelect(i)}
					shipmentAccount={account}
					{selectedLocation}
					shipmentId={i}
				/>
			{/each}
		</ul>
	{:else}
		<p
			class="mt-1 text-center text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
		>
			Nothing found
		</p>
	{/if}
</LayoutListWrapper>

<ShipmentsLocations
	locations={locationsOnMap}
	{onMarkerClick}
	{selectedLocation}
	isMobile={false}
/>
