import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';

import { anchorStore } from '$src/stores/anchor';
import type {
	AcceptedShipmentOfferAccount,
	ApiAcceptedShipmentOfferAccount
} from '$src/utils/account/acceptedOffer';
import { parseAcceptedOfferToApiAcceptedOffer } from '$src/utils/parse/acceptedOffer';

export async function GET() {
	const { program } = get(anchorStore);

	let acceptedOffers: AcceptedShipmentOfferAccount[] = await program.account.acceptedOffer.all();

	let apiAcceptedOffers: ApiAcceptedShipmentOfferAccount[] = acceptedOffers.map((offer) => {
		return {
			publicKey: offer.publicKey.toString(),
			account: parseAcceptedOfferToApiAcceptedOffer(offer.account)
		};
	});

	return json(apiAcceptedOffers);
}
