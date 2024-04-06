<script lang="ts">
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import ShipmentLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { acceptedShipmentOffers, type AcceptedShipment } from '$src/stores/acceptedOffers';
	import AcceptedOfferListElement from '$src/components/AcceptedOffer/AcceptedOfferListElement.svelte';

	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;
	let isOpen = false;

	let showShipmentDetailsModal = false;
	let selectedAcceptedOffer: AcceptedShipment | undefined = undefined;

	$: shipmentLocations = $acceptedShipmentOffers.map(
		(offerWithShipment) => offerWithShipment.shipment.account.shipment.geography
	);

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

<svelte:head><title>Accepted offers</title></svelte:head>

{#if $acceptedShipmentOffers.length != 0}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each $acceptedShipmentOffers as offer, i}
				<AcceptedOfferListElement
					acceptedOfferMeta={offer.meta}
					on:click={() => onElementSelect(i)}
					on:buttonClick={() => {
						selectedAcceptedOffer = offer;
					}}
					on:shipmentShow={() => {
						selectedAcceptedOffer = offer;
						showShipmentDetailsModal = !showShipmentDetailsModal;
					}}
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

<ShipmentLocations
	locations={shipmentLocations}
	{onMarkerClick}
	{selectedLocation}
	exclusive={false}
	isMobile={false}
/>
