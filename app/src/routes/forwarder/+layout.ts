import { acceptedShipmentOffers, acceptedShipmentsOffersMeta } from '$src/stores/acceptedOffers.js';
import { forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
import { shipmentsOffersMeta } from '$src/stores/offers.js';
import type { ApiAcceptedShipmentOfferAccount } from '$src/utils/account/acceptedOffer.js';
import type { ApiCarrierAccount } from '$src/utils/account/carrier.js';
import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';
import type { ApiShipmentOfferAccount } from '$src/utils/account/offer.js';
import { error } from '@sveltejs/kit';


/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{
	forwardedShipments: ApiForwardedShipmentAccount[];
	carriers: ApiCarrierAccount[];
}> {
	try {
		const [fetchedForwardedShipments, fetchCarriers, fetchOffers] = await Promise.all([
			fetch('/api/forwardedShipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			fetch('/api/carriers', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			fetch('/api/offers/all', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			})
		]);

		const [forwardedShipments, carriers, bothOffers] = await Promise.all<
			[Promise<ApiForwardedShipmentAccount[]>, Promise<ApiCarrierAccount[]>, Promise<{offers: ApiShipmentOfferAccount[], accepted: ApiAcceptedShipmentOfferAccount[]}>]
		>([fetchedForwardedShipments.json(), fetchCarriers.json(), fetchOffers.json()]);

		forwardedShipmentsMeta.set(forwardedShipments);
		shipmentsOffersMeta.set(bothOffers.offers);
		acceptedShipmentsOffersMeta.set(bothOffers.accepted);

		return { forwardedShipments, carriers };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
