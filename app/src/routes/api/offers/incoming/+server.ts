import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type {
	ApiShipmentOfferAccount,
	ShipmentOfferAccount
} from '$src/utils/account/offer';
import { anchorStore } from '$src/stores/anchor';
import { parseOfferToApiOffer } from '$src/utils/parse/offer';

export async function GET() {
	const { program } = get(anchorStore);

	let offers: ShipmentOfferAccount[] = await program.account.shipmentOffer.all();

	let offersParsed: ApiShipmentOfferAccount[] = offers.map((offer) => {
		return {
			publicKey: offer.publicKey.toString(),
			account: parseOfferToApiOffer(offer.account)
		};
	});


	return json(offersParsed);
}
