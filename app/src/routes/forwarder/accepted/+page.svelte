<script lang="ts">
	import CarriersLocations from '$src/components/ShipmentMap/CarriersLocations.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import ForwarderAcceptedListElement from '$src/components/Offer/FowarderAcceptedListElement.svelte';
	import { walletStore } from '$src/stores/wallet';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import type { PageData } from './$types';
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';
	import { acceptedShipmentOffers, type AcceptedShipment } from '$src/stores/acceptedOffers';
	import type { ApiAcceptedShipmentOffer } from '$src/utils/account/acceptedOffer';

	export let data: PageData;

	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let selectedOffer: AcceptedShipment | undefined = undefined;
	let showShipmentDetailsModal = false;
	let showMakeOfferModal = false;

	$: carriers = data.carriers;
	$: isWalletConnected = $walletStore.publicKey != null;

	$: shipments = myAcceptedShipments.map((offerWithShipment) => offerWithShipment.shipment);

	// not disappear until accepted
	$: myAcceptedShipments = isWalletConnected
		? $acceptedShipmentOffers.filter(
				(s) => s.shipment.account.forwarder.toString() === $walletStore.publicKey?.toString()
			)
		: [];

	function onElementSelect(accepted: AcceptedShipment) {
		selectedOffer = accepted;
		selectedShipment = accepted.shipment;
	}

	function onShowClicked(accepted: AcceptedShipment) {
		onElementSelect(accepted);
		showShipmentDetailsModal = true;
	}
</script>

{#if myAcceptedShipments.length != 0}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each myAcceptedShipments as accepted, i (accepted.meta.publicKey)}
				<ForwarderAcceptedListElement
					on:click={() => onElementSelect(accepted)}
					offerAccount={accepted}
					on:buttonClick={() => onShowClicked(accepted)}
					selectedShipment={selectedShipment?.publicKey}
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

{#if selectedOffer}
	<ShipmentInformationModal
		shipmentAccount={selectedOffer.shipment}
		bind:showModal={showShipmentDetailsModal}
	/>
{/if}

<ShipmentsLocations {shipments} bind:selectedShipment />
