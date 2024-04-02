<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { notForwardedShipments } from '$src/stores/searchableShipments';

	$: locationsOnMap = $notForwardedShipments.map((s) => s.account.shipment.geography);
	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;

	function onElementSelect(i: number) {
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onMarkerClick(i: number) {
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if $notForwardedShipments.length != 0}
		<div class="h-full flex items-start">
			<ul>
				{#each $notForwardedShipments as account, i (account.publicKey)}
					<OrderListElement
						on:click={() => onElementSelect(i)}
						shipmentAccount={account}
						{selectedLocation}
						shipmentId={i}
					/>
				{/each}
			</ul>
		</div>
	{:else}
		<p class="text-xl text-gray-500">Nothing found</p>
	{/if}
</LayoutListWrapper>

<ShipmentsLocations
	locations={locationsOnMap}
	{onMarkerClick}
	exclusive={false}
	{selectedLocation}
	isMobile={false}
/>
