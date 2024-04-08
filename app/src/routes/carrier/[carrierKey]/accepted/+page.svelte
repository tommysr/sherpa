<script lang="ts">
	import AcceptedOfferListElement from '$src/components/AcceptedOffer/AcceptedOfferListElement.svelte';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { acceptedShipmentOffers, type AcceptedShipment } from '$src/stores/acceptedOffers';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';

	let showShipmentDetailsModal = false;
	let selectedAcceptedOffer: AcceptedShipment | undefined = undefined;
	let selectedShipment: ApiShipmentAccount | undefined = undefined;

	$: shipments = $acceptedShipmentOffers.map((offerWithShipment) => offerWithShipment.shipment);

	function onElementSelect(offer: AcceptedShipment) {
		selectedAcceptedOffer = offer;
		selectedShipment = offer.shipment;
	}

	function onShowClicked(offer: AcceptedShipment) {
		onElementSelect(offer);

		showShipmentDetailsModal = true;
	}
</script>

<svelte:head><title>Accepted offers</title></svelte:head>

{#if $acceptedShipmentOffers.length != 0}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each $acceptedShipmentOffers as offer, i}
				<AcceptedOfferListElement
					acceptedOffer={offer}
					on:click={() => onElementSelect(offer)}
					on:buttonClick={() => onElementSelect(offer)}
					on:shipmentShow={() => onShowClicked(offer)}
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

<!--  Modal for showing shipment details, just one, less rendering -->
{#if selectedAcceptedOffer}
	<ShipmentInformationModal
		shipmentAccount={selectedAcceptedOffer.shipment}
		bind:showModal={showShipmentDetailsModal}
	/>
{/if}

<ShipmentsLocations {shipments} bind:selectedShipment />
