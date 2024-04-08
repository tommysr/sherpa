import type { SearchableShipment } from '$src/stores/searchableShipments';
import { searchableShipments } from '$src/stores/searchableShipments';
import type { ApiShipmentAccount } from '$src/utils/account/shipment';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{
	shipments: ApiShipmentAccount[];
}> {

	try {
		const fetchedShipments = await fetch('/api/shipments', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const shipments: ApiShipmentAccount[] = await fetchedShipments.json();

		// TODO: make it more specific
		const searchableShipmentsArr: SearchableShipment[] = shipments.map(
			(shipment: ApiShipmentAccount) => {
				return {
					...shipment,
					searchParams: `${shipment.account.shipment.details.priority} ${shipment.account.shipment.details.access}`
				};
			}
		);

		searchableShipments.default(searchableShipmentsArr);

		return { shipments };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
