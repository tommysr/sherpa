import type { ShipmentAccount } from '$src/utils/idl/shipment';
import type { MockTransportOrder } from '$src/utils/types/mockTransport';
import type { ProgramAccount } from '@coral-xyz/anchor';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{ orders: ShipmentAccount[] }> {
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
