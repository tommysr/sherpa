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
	const { program } = get(anchorStore);

	function subscribeToOffersEvents(): number[] {
		const unsubscribeOfferMade = program.addEventListener('OfferMade', async (event) => {
			const offerPublicKey = event.offer;

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

		const unsubscribeOfferAccepted = program.addEventListener('OfferAccepted', async (event) => {
			const acceptedOfferPublicKey = event.offer;
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
