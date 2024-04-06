<script lang="ts">
	import { Control, ControlButton, ControlGroup } from 'svelte-maplibre';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { anchorStore } from '$src/stores/anchor';
	import type {
		ApiShipmentOfferAccount,
		ShipmentOffer,
		ShipmentOfferAccount
	} from '$src/utils/account/offer';
	import { parseOfferToApiOffer } from '$src/utils/parse/offer';
	import { type AcceptedShipment, acceptedShipmentsOffersMeta } from '$src/stores/acceptedOffers';
	import { shipmentsOffersMeta } from '$src/stores/offers';
	import type {
		AcceptedShipmentOffer,
		ApiAcceptedShipmentOfferAccount
	} from '$src/utils/account/acceptedOffer';
	import { parseAcceptedOfferToApiAcceptedOffer } from '$src/utils/parse/acceptedOffer';
	import { onMount } from 'svelte';
	import { walletStore } from '$src/stores/wallet';
	import Page from '../+page.svelte';
	const { program } = get(anchorStore);

	function subscribeToOffersEvents(): number[] {
		const unsubscribeOfferMade = program.addEventListener('OfferMade', async (event) => {
			const offerPublicKey = event.offer;

			// Carrier is only interested in offers made to him
			if (!$walletStore.publicKey || event.to.toString() != $walletStore.publicKey.toString()) {
				return;	
			}

			const offer: ShipmentOffer = await program.account.shipmentOffer.fetch(offerPublicKey);

			const parsedOffer: ApiShipmentOfferAccount = {
				publicKey: offerPublicKey.toString(),
				account: parseOfferToApiOffer(offer)
			};

			shipmentsOffersMeta.update((s) => {
				s = [...s, parsedOffer];
				return s;
			});
		});


		// this is also information which forwarder cares about
		const unsubscribeOfferAccepted = program.addEventListener('OfferAccepted', async (event) => {
			const acceptedOfferPublicKey = event.offer;

			// Check not to include foreign offers just these which carrier accepted during session
			if (!$walletStore.publicKey || event.to.toString() != $walletStore.publicKey.toString()) {
				return;	
			}

			const acceptedOffer: AcceptedShipmentOffer =
				await program.account.acceptedOffer.fetch(acceptedOfferPublicKey);

			const parsedOffer: ApiAcceptedShipmentOfferAccount = {
				publicKey: acceptedOfferPublicKey.toString(),
				account: parseAcceptedOfferToApiAcceptedOffer(acceptedOffer)
			};

			acceptedShipmentsOffersMeta.update((s) => {
				s = [...s, parsedOffer];
				return s;
			});
		});

		return [unsubscribeOfferMade, unsubscribeOfferAccepted];
	}

	onMount(() => {
		const unsubscribe = subscribeToOffersEvents();
		return () => {
			for (const listener of unsubscribe) {
				program.removeEventListener(listener);
			}
		};
	});

	$: key = $page.params['carrierKey'];
</script>


<!-- Consider replacing it by some better ui -->
<Control position="top-left">
	<ControlGroup>
		<a href="/carrier/{key}/incoming">
			<ControlButton>N</ControlButton>
		</a>
		<a href="/carrier/{key}/accepted">
			<ControlButton>A</ControlButton>
		</a>
	</ControlGroup>
</Control>

<slot />
