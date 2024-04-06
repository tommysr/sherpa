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

			createNotification({
				text: 'Wallet not connected',
				type: 'failed',
				removeAfter: 5000
			});

			return;
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
				text: 'Transaction send',
				type: 'success',
				removeAfter: 5000,
				signature: sig
			});
		} catch (err) {
			createNotification({ text: 'Transaction send', type: 'failed', removeAfter: 5000 });
		}
	};
</script>

<svelte:head><title>Incoming offers</title></svelte:head>


{#if $shipmentOffers.length != 0}
	<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
		<ul class="w-full flex-1 space-y-4">
			{#each $shipmentOffers as offer, i}
					<OfferListElement
						offerMeta={offer.meta}
						on:click={() => onElementSelect(i)}
						on:buttonClick={async () => {
							selectedOffer = offer;
							await acceptShipmentOffer();
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
