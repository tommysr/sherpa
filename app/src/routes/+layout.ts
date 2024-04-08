import { acceptedShipmentsOffersMeta } from '$src/stores/acceptedOffers.js';
import { shipmentsOffersMeta } from '$src/stores/offers.js';
import type { SearchableShipment } from '$src/stores/searchableShipments';
import { searchableShipments } from '$src/stores/searchableShipments';
import type { ApiAcceptedShipmentOfferAccount } from '$src/utils/account/acceptedOffer.js';
import type { ApiShipmentOfferAccount } from '$src/utils/account/offer.js';
import type { ApiShipmentAccount } from '$src/utils/account/shipment';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{
	shipments: ApiShipmentAccount[];
	offers: ApiShipmentOfferAccount[];
	acceptedOffers: ApiAcceptedShipmentOfferAccount[];
}> {
	try {

		const [fetchedShipments, fetchedOffers, fetchedAcceptedOffers] = await Promise.all([
			fetch('/api/shipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			fetch('/api/offers/incoming', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			fetch('/api/offers/accepted', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			})
		]);

		const [shipments, offers, acceptedOffers] = await Promise.all<
			[
				Promise<ApiShipmentAccount[]>,
				Promise<ApiShipmentOfferAccount[]>,
				Promise<ApiAcceptedShipmentOfferAccount[]>
			]
		>([fetchedShipments.json(), fetchedOffers.json(), fetchedAcceptedOffers.json()]);

		// TODO: make it more specific
		const searchableShipmentsArr: SearchableShipment[] = shipments.map(
			(shipment: ApiShipmentAccount) => {
				return {
					...shipment,
					searchParams: `${shipment.account.shipment.details.priority} ${shipment.account.shipment.details.access}`
				};
			}
		);

		shipmentsOffersMeta.set(offers);
		acceptedShipmentsOffersMeta.set(acceptedOffers);
		searchableShipments.default(searchableShipmentsArr);

		return { shipments, offers, acceptedOffers };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
