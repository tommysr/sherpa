<script lang="ts">
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import OfferListElement from '$src/components/Offer/OfferListElement.svelte';
	import { shipmentOffers, type OfferedShipment } from '$src/stores/offers';
	import ShipmentLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { getAcceptShipmentOfferTx } from '$lib/offer';
	import { get } from 'svelte/store';
	import { anchorStore } from '$stores/anchor';
	import { walletStore } from '$stores/wallet';
	import { web3Store } from '$stores/web3';
	import { PublicKey } from '@solana/web3.js';
	import { useSignAndSendTransaction } from '$utils/wallet/singAndSendTx';
	import { createNotification } from '$components/Notification/notificationsStore';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import AcceptShipmentModal from '$src/components/Modals/AcceptShipmentModal.svelte';
	import { getAcceptedOfferAddresses, getCarrierAddress, getOfferAddresses } from '$sdk/sdk';

	let selectedOffer: OfferedShipment | undefined = undefined;
	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let showShipmentDetailsModal = false;
	let showAcceptOfferModal = false;
	$: isWalletConnected = $walletStore.publicKey != null;

	$: offerAddresses = getOfferAddresses($anchorStore.program, $walletStore.publicKey!, 100).map(
		(p) => p.toString()
	);

	// not disappear until accepted
	$: myOfferedShipments = isWalletConnected
		? $shipmentOffers.filter((s) => offerAddresses.includes(s.meta.publicKey))
		: [];

	$: console.log('gg', offerAddresses, $shipmentOffers, myOfferedShipments);

	$: shipments = myOfferedShipments.map((offerWithShipment) => offerWithShipment.shipment);

	function onElementSelect(offer: OfferedShipment) {
		selectedShipment = offer.shipment;
		selectedOffer = offer;
	}

	function onShowClicked(offer: OfferedShipment) {
		onElementSelect(offer);

		showShipmentDetailsModal = true;
	}
</script>

<svelte:head><title>Incoming offers</title></svelte:head>

{#if myOfferedShipments.length != 0}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each myOfferedShipments as offer, i (offer.meta.publicKey)}
				<OfferListElement
					offerAccount={offer}
					on:click={() => onElementSelect(offer)}
					on:acceptClick={async () => {
						onElementSelect(offer);
						showAcceptOfferModal = true;
					}}
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

<!--  Modal for showing shipment details, just one, less rendering -->
{#if selectedOffer}
	<ShipmentInformationModal
		shipmentAccount={selectedOffer.shipment}
		bind:showModal={showShipmentDetailsModal}
	/>

	<AcceptShipmentModal offer={selectedOffer} bind:showModal={showAcceptOfferModal} />
{/if}

<ShipmentsLocations {shipments} bind:selectedShipment />
