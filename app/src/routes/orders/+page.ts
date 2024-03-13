import type { ApiShipmentAccount, ShipmentAccount } from '$src/utils/idl/shipment';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{ orders: ApiShipmentAccount[] }> {
	try {
		const fetchedOrders = await fetch('/api/orders', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		return { orders: await fetchedOrders.json() };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
