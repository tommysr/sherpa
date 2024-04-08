<script lang="ts">
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import CarriersLocations from '$src/components/ShipmentMap/CarriersLocations.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { forwardedShipments, forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import { walletStore } from '$src/stores/wallet';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import type { PageData } from './$types';
	import MakeOfferModal from '$src/components/Modals/MakeOfferModal.svelte';
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';
	import { shipmentOffers, type OfferedShipment } from '$src/stores/offers';
	import OfferListElement from '$src/components/Offer/OfferListElement.svelte';
	import ForwarderOfferListElement from '$src/components/Offer/ForwarderOfferListElement.svelte';

	export let data: PageData;



	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let selectedOffer: OfferedShipment | undefined = undefined;
	let showShipmentDetailsModal = false;



	$: shipments = myOfferedShipments.map((offerWithShipment) => offerWithShipment.shipment);


	$: carriers = data.carriers;
	$: isWalletConnected = $walletStore.publicKey != null;

	// not disappear until accepted
	$: myOfferedShipments = isWalletConnected
		? $shipmentOffers.filter(
				(s) =>
					s.meta.account.offeror.toString() === $walletStore.publicKey?.toString() &&
					s.shipment.account.status == 3
			)
		: [];

	function onElementSelect(offer: OfferedShipment) {
		selectedOffer = offer;
		selectedShipment = offer.shipment;
	}

	function onShowClicked(offer: OfferedShipment) {
		onElementSelect(offer);
		showShipmentDetailsModal = true;
	}
</script>

{#if myOfferedShipments.length != 0}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each myOfferedShipments as offer, i (offer.meta.publicKey)}
				<ForwarderOfferListElement
					offerAccount={offer}
					on:click={() => onElementSelect(offer)}
					on:buttonClick={() => onShowClicked(offer)}
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
