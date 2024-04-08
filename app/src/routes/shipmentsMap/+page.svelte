<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import ShipmentBuyModal from '$src/components/Modals/ShipmentBuyModal.svelte';
	import ShipmentShowModal from '$src/components/Modals/ShipmentBuyModal.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { notForwardedShipments } from '$src/stores/searchableShipments';
	import { walletStore } from '$src/stores/wallet';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';

	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let showBuyShipmentModal = false;
	let isMobileOpen = false;

	$: isWalletConnected = $walletStore.publicKey != null;

	function onSelectShipment(shipment: ApiShipmentAccount) {
		if (isMobileOpen) {
			isMobileOpen = false;
		}

		selectedShipment = shipment;
	}

	function onShowClicked(shipment: ApiShipmentAccount) {
		onSelectShipment(shipment);

		showBuyShipmentModal = true;
	}
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if $notForwardedShipments.length != 0}
		<div class="flex-1 flex w-full flex-col overflow-y-auto px-4">
			<ul class="w-full flex-1 space-y-4">
				{#each $notForwardedShipments as shipment, i (shipment.publicKey)}
					<OrderListElement
						on:click={() => onSelectShipment(shipment)}
						on:buttonClicked={() => onShowClicked(shipment)}
						shipmentAccount={shipment}
						selectedAccount={selectedShipment?.publicKey}
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

<ShipmentsLocations shipments={$notForwardedShipments} bind:selectedShipment />

{#if selectedShipment}
	<ShipmentBuyModal shipmentAccount={selectedShipment} bind:showModal={showBuyShipmentModal} />
{/if}
