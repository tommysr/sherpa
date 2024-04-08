import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type {
	ApiShipmentOfferAccount,
	ShipmentOfferAccount
} from '$src/utils/account/offer';
import { anchorStore } from '$src/stores/anchor';
import { parseOfferToApiOffer } from '$src/utils/parse/offer';
import type {
	AcceptedShipmentOfferAccount,
	ApiAcceptedShipmentOfferAccount
} from '$src/utils/account/acceptedOffer';
import { parseAcceptedOfferToApiAcceptedOffer } from '$src/utils/parse/acceptedOffer';

export async function GET() {
	const { program } = get(anchorStore);

	let offers: ShipmentOfferAccount[] = await program.account.shipmentOffer.all();

	let apiOffers: ApiShipmentOfferAccount[] = offers.map((offer) => {
		return {
			publicKey: offer.publicKey.toString(),
			account: parseOfferToApiOffer(offer.account)
		};
	});

	let acceptedOffers: AcceptedShipmentOfferAccount[] = await program.account.acceptedOffer.all();

	let apiAcceptedOffers: ApiAcceptedShipmentOfferAccount[] = acceptedOffers.map((offer) => {
		return {
			publicKey: offer.publicKey.toString(),
			account: parseAcceptedOfferToApiAcceptedOffer(offer.account)
		};
	});

	return json({
		offers: apiOffers,
		accepted: apiAcceptedOffers
	});
}
