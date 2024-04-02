import { forwardedShipmentsMeta } from '$src/stores/forwarderShipments.js';
import type { SearchableShipment } from '$src/stores/searchableShipments';
import { searchableShipments } from '$src/stores/searchableShipments';
import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';
import type { ApiShipmentAccount } from '$src/utils/account/shipment';

import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

function loadFromStores(): {
	shipments: ApiShipmentAccount[];
	forwardedShipments: ApiForwardedShipmentAccount[];
} | null {
	const { data: shipments } = get(searchableShipments);
	const forwardedShipments = get(forwardedShipmentsMeta);
	const len = shipments.length;

	if (len > 0) {
		return {
			shipments: shipments.map(({ account, publicKey }) => {
				return {
					account,
					publicKey
				};
			}),
			forwardedShipments
		};
	} else {
		return null;
	}
}

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{
	shipments: ApiShipmentAccount[];
	forwardedShipments: ApiForwardedShipmentAccount[];
}> {
	console.log('loading shipments');
	const fromStores = loadFromStores();

	if (fromStores) {
		return fromStores;
	}

	try {
		const [fetchedShipments, fetchedForwardedShipments] = await Promise.all([
			fetch('/api/shipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			fetch('/api/forwardedShipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			})
		]);

		const [shipments, forwardedShipments] = await Promise.all<
			[Promise<ApiShipmentAccount[]>, Promise<ApiForwardedShipmentAccount[]>]
		>([fetchedShipments.json(), fetchedForwardedShipments.json()]);

		// TODO: make it more specific
		const searchableShipmentsArr: SearchableShipment[] = shipments.map(
			(shipment: ApiShipmentAccount) => {
				return {
					...shipment,
					searchParams: `${shipment.account.shipment.details.priority} ${shipment.account.shipment.details.access}`
				};
			}
		);

		forwardedShipmentsMeta.set(forwardedShipments);
		searchableShipments.default(searchableShipmentsArr);

		return { shipments, forwardedShipments };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
