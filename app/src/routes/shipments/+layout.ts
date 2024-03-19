import {
	searchableBoughtShipments,
	type SearchableBoughtOrder
} from '$src/stores/forwarderShipments.js';
import type { SearchableOrder } from '$src/stores/searchableShipments';
import { searchableShipments } from '$src/stores/searchableShipments';
import type { ApiBoughtShipmentAccount } from '$src/utils/idl/boughtShipment.js';
import type { ApiShipmentAccount, ShipmentAccount } from '$src/utils/idl/shipment';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({
	fetch
}): Promise<{ orders: ApiShipmentAccount[]; boughtOrders: ApiBoughtShipmentAccount[] }> {
	try {
		const [fetchedOrders, fetchedBoughtOrders] = await Promise.all([
			fetch('/api/shipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			await fetch('/api/boughtShipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			})
		]);

		const [orders, boughtOrders] = await Promise.all<
			[Promise<ApiShipmentAccount[]>, Promise<ApiBoughtShipmentAccount[]>]
		>([fetchedOrders.json(), fetchedBoughtOrders.json()]);

		// TODO: make it more specific
		const searchableOrders: SearchableOrder[] = orders.map((order: ApiShipmentAccount) => {
			return {
				...order,
				searchParams: `${order.account.shipment.details.priority} ${order.account.shipment.details.access}`
			};
		});

		// TODO: make it more specific
		const searchableBoughtOrders: SearchableBoughtOrder[] = boughtOrders.map(
			(order: ApiBoughtShipmentAccount) => {
				return {
					...order,
					searchParams: `${order.account.shipment.details.priority} ${order.account.shipment.details.access}`
				};
			}
		);

		console.log(orders, boughtOrders);

		searchableShipments.default(searchableOrders);
		searchableBoughtShipments.default(searchableBoughtOrders);

		return { orders, boughtOrders };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
