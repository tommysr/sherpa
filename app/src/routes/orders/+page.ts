import type { MockTransportOrder } from '$src/utils/types/mockTransport';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load() {
	try {
		const fetchedOrders = await fetch('/api/orders', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const unpackedOrders: MockTransportOrder[] = await fetchedOrders.json();

		return { orders: unpackedOrders };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
