import { acceptedShipmentsOffersMeta } from '$src/stores/acceptedOffers.js';
import { shipmentsOffersMeta } from '$src/stores/offers';
import type { ApiAcceptedShipmentOfferAccount } from '$src/utils/account/acceptedOffer.js';
import type { ApiShipmentOfferAccount } from '$src/utils/account/offer';

import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({ fetch, params }): Promise<{ offers: ApiShipmentOfferAccount[], accepted: ApiAcceptedShipmentOfferAccount[];}> {


	try {
		const [fetchedOffers, fetchedAcceptedOffers] = await Promise.all([
			fetch(`/api/offers/${params.carrierKey}/incoming`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			fetch(`/api/offers/${params.carrierKey}/accepted`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			})
		]);

		const [offers, acceptedOffers] = await Promise.all<
			[Promise<ApiShipmentOfferAccount[]>, Promise<ApiAcceptedShipmentOfferAccount[]>]
		>([fetchedOffers.json(), fetchedAcceptedOffers.json()]);

		shipmentsOffersMeta.set(offers);
		acceptedShipmentsOffersMeta.set(acceptedOffers)


		return { offers, accepted: acceptedOffers };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
