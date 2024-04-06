<script lang="ts">
	import CarrierListElement from '$src/components/Shipment/CarrierListElement.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import CarriersLocations from '$src/components/ShipmentMap/CarriersLocations.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { forwardedShipments, forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import { walletStore } from '$src/stores/wallet';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import type { PageData } from './$types';

	enum OperationMode {
		VIEW,
		SELL
	}

	export let data: PageData;

	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let showShipmentDetailsModal = false;

	let selectedLocation: number | undefined = undefined;
	let selectedCarrier: number | undefined = undefined;
	let isMobileOpen = false;
	let operationModeSwitch = false;

	$: carriers = data.carriers;
	$: locationsOnMap = $forwardedShipments.map((s) => s.shipment.account.shipment.geography);
	$: isWalletConnected = $walletStore.publicKey != null;
	$: operationMode = operationModeSwitch ? OperationMode.SELL : OperationMode.VIEW;
	$: isExclusiveMode = operationMode == OperationMode.SELL && selectedLocation != undefined;

	$: if ($walletStore.publicKey) {
		// TODO: make it custom
		forwardedShipmentsMeta.update((s) => {
			s.filter((s) => s.account.forwarder === $walletStore.publicKey?.toString());

			return s;
		});
	}

	function onMarkerClick(i: number) {
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

	function onCarrierMarkerClick(i: number) {
		selectedCarrier = i;
	}
</script>

{#if operationMode == OperationMode.SELL}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each carriers as carrier, i}
				<CarrierListElement
					on:click={() => onCarrierElementSelect(i)}
					{selectedCarrier}
					{selectedLocation}
					carrierAccount={carrier}
					carrierId={i}
				/>
			{/each}
		</ul>
	</div>
{:else}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each $forwardedShipments as { meta, shipment }, i}
				<OrderListElement
					on:click={() => {
						selectedShipment = shipment;
						onMarkerClick(i);
					}}
					on:buttonClicked={() => {
						selectedShipment = shipment;
						showShipmentDetailsModal = true;
					}}
					shipmentAccount={shipment}
					{selectedLocation}
					shipmentId={i}
				/>
			{/each}
		</ul>
	</div>
{/if}

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

{#if selectedShipment}
	<ShipmentInformationModal
		shipmentAccount={selectedShipment}
		bind:showModal={showShipmentDetailsModal}
	/>
{/if}
