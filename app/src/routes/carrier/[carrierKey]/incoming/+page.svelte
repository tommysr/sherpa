<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import OfferListElement from '$src/components/Offer/OfferListElement.svelte';
	import ReworkedOrderListElement from '$src/components/Shipment/ReworkedOrderListElement.svelte';
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

	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;
	let isOpen = false;

	let showShipmentDetailsModal = false;
	let selectedOffer: OfferedShipment | undefined = undefined;

	$: shipmentLocations = $shipmentOffers.map(
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

	const acceptShipmentOffer = async () => {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);

		if (!$walletStore.publicKey) {
			walletStore.openModal();

			throw 'wallet not connected';
		}

		const tx = await getAcceptShipmentOfferTx(
			program,
			$walletStore.publicKey,
			new PublicKey(selectedOffer!.meta.account.offeror),
			new PublicKey(selectedOffer!.shipment.publicKey),
			selectedOffer!.meta.account.no
		);

		try {
			const sig = await useSignAndSendTransaction(connection, wallet, tx);

			createNotification({
				text: 'accept offer tx sent',
				type: 'success',
				removeAfter: 3000,
				signature: sig
			});
		} catch (err) {
			createNotification({ text: 'signing failed', type: 'failed', removeAfter: 3000 });
		}
	};
</script>

<svelte:head><title>Incoming offers</title></svelte:head>

<LayoutListWrapper bind:isMobileOpen>
	{#if $shipmentOffers.length != 0}
		<div class="h-full flex items-start">
			<ul>
				{#each $shipmentOffers as offer, i}
					<div class="flex flex-col">
						<OfferListElement
							offerMeta={offer.meta}
							on:click={() => onElementSelect(i)}
							on:buttonClick={async () => {
								selectedOffer = offer;
								await acceptShipmentOffer();
							}}
						/>
						<button
							class="mt-1 border-2 border-secondary-600 rounded-full px-2 font-bold text-secondary-600 bg-primary-100 hover:bg-secondary-600 hover:text-white"
							on:click={() => (isOpen = !isOpen)}
							>{isOpen ? 'hide shipment' : 'show shipment'}</button
						>
						{#if isOpen}
							<ReworkedOrderListElement
								on:buttonClick={() => {
									selectedOffer = offer;
									showShipmentDetailsModal = true;
								}}
								shipmentAccount={offer.shipment}
								shipmentId={i}
							/>
						{/if}
					</div>
				{/each}
			</ul>
		</div>
	{:else}
		<p class="text-xl text-gray-500">Nothing found</p>
	{/if}
</LayoutListWrapper>

<!--  Modal for showing shipment details, just one, less rendering -->
{#if selectedOffer}
	<ShipmentInformationModal
		shipmentAccount={selectedOffer.shipment}
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
