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
		<div class="flex-1 flex w-full flex-col overflow-y-auto px-4">
			<ul class="w-full flex-1 space-y-4">
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
		<div class="flex-1 flex items-center">
			<p
				class="mb-5 text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
			>
				Nothing found
			</p>
		</div>
	{/if}
</LayoutListWrapper>

<ShipmentsLocations
	locations={locationsOnMap}
	{onMarkerClick}
	exclusive={false}
	{selectedLocation}
	isMobile={false}
/>
