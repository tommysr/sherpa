import type { SearchableOrder } from '$src/stores/searchableShipments';
import { searchableShipments } from '$src/stores/searchableShipments';
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
		const orders: ApiShipmentAccount[] = await fetchedOrders.json();

		const searchableOrders: SearchableOrder[] = orders.map((order: ApiShipmentAccount) => {
			return { ...order, searchParams: `${order.account.shipment.details.priority} ${order.account.shipment.details.access}` };
		});

		searchableShipments.default(searchableOrders);

		return { orders };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
