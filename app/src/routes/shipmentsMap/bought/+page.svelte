<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import BoughtOrderListElement from '$src/components/Shipment/BoughtOrderListElement.svelte';
	import CarrierListElement from '$src/components/Shipment/CarrierListElement.svelte';
	import CarriersLocations from '$src/components/ShipmentMap/CarriersLocations.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { forwardedShipments, forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
	import { walletStore } from '$stores/wallet';
	import type { PageData } from './$types';

	enum OperationMode {
		VIEW,
		SELL
	}

	$: if ($walletStore.publicKey) {
		// TODO: make it custom
		forwardedShipmentsMeta.update((s) => {
			s.filter((s) => s.account.forwarder === $walletStore.publicKey?.toString());

			return s;
		});
	}

	$: carriers = data.carriers;
	$: locationsOnMap = $forwardedShipments.map((s) => s.shipment.account.shipment.geography);
	$: isWalletConnected = $walletStore.publicKey != null;
	$: operationMode = operationModeSwitch ? OperationMode.SELL : OperationMode.VIEW;
	$: isExclusiveMode = operationMode == OperationMode.SELL && selectedLocation != undefined;

	export let data: PageData;
	let selectedLocation: number | undefined = undefined;
	let selectedCarrier: number | undefined = undefined;
	let isMobileOpen = false;
	let operationModeSwitch = false;

	function onShipmentElementSelect(i: number) {
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onCarrierElementSelect(i: number) {
		selectedCarrier = i;

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

	function onCarrierMarkerClick(i: number) {
		selectedCarrier = i;
	}
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if !isWalletConnected}
		<p
			class="mt-1 text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-2/3"
		>
			Connect your wallet to view shipments
		</p>
	{:else if $forwardedShipments.length != 0}
		<div class="flex-1 flex w-full flex-col overflow-y-auto px-4">
			<ul class="w-full flex-1 space-y-4">
				{#if operationMode == OperationMode.SELL}
					{#each carriers as carrier, i}
						<CarrierListElement
							on:click={() => onCarrierElementSelect(i)}
							{selectedCarrier}
							{selectedLocation}
							carrierAccount={carrier}
							carrierId={i}
						/>
					{/each}
				{:else}
					{#each $forwardedShipments as { meta }, i}
						<BoughtOrderListElement
							on:click={() => onShipmentElementSelect(i)}
							shipmentAccount={meta}
							{selectedLocation}
							shipmentId={i}
						/>
					{/each}
				{/if}
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

{#if isWalletConnected}
	<ShipmentsLocations
		locations={locationsOnMap}
		{onMarkerClick}
		{selectedLocation}
		exclusive={isExclusiveMode}
		isMobile={false}
	/>

	{#if operationMode == OperationMode.SELL}
		<CarriersLocations
			{carriers}
			{selectedCarrier}
			onMarkerClick={onCarrierMarkerClick}
			isMobile={false}
		/>
	{/if}
{/if}
