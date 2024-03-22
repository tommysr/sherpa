import {
	searchableShipmentOffers,
	type SearchableShipmentOffer
} from '$src/stores/shipmentOffers.js';

import type { ApiShipmentOfferAccount } from '$src/utils/idl/shipmentOffer.js';

import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

function loadFromStores(): {
	offers: ApiShipmentOfferAccount[];
} | null {
	const { data: offers } = get(searchableShipmentOffers);
	const len = offers.length;

	if (len > 0) {
		return {
			offers: offers.map(({ account, publicKey }) => {
				return {
					account,
					publicKey
				};
			})
		};
	} else {
		return null;
	}
}

/** @type {import('./$types').PageLoad } */
export async function load({ fetch, params }): Promise<{ offers: ApiShipmentOfferAccount[] }> {
	console.log('loading offers');
	const fromStores = loadFromStores();

	if (fromStores) {
		return fromStores;
	}

	try {
		const fetchedOffers = await fetch(`/api/offers/${params.carrierKey}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const offers: ApiShipmentOfferAccount[] = await fetchedOffers.json();

		const searchableOffers: SearchableShipmentOffer[] = offers.map(
			(offer: ApiShipmentOfferAccount) => {
				return {
					...offer,
					searchParams: `${offer.account.owner.toString()} ${offer.account.details.payment} ${offer.account.details.collateral}`
				};
			}
		);

		searchableShipmentOffers.default(searchableOffers);

		return { offers };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
