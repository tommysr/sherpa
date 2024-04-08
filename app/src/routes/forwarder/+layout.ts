import { forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
import type { ApiCarrierAccount } from '$src/utils/account/carrier.js';
import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';
import { error } from '@sveltejs/kit';


/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{
	forwardedShipments: ApiForwardedShipmentAccount[];
	carriers: ApiCarrierAccount[];
}> {
	try {
		const [fetchedForwardedShipments, fetchCarriers] = await Promise.all([
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
		]);

		const [forwardedShipments, carriers] = await Promise.all<
			[Promise<ApiForwardedShipmentAccount[]>, Promise<ApiCarrierAccount[]>]
		>([fetchedForwardedShipments.json(), fetchCarriers.json()]);

		forwardedShipmentsMeta.set(forwardedShipments);

		return { forwardedShipments, carriers };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
