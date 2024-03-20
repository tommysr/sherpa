import {
	searchableBoughtShipments,
	type SearchableBoughtOrder
} from '$src/stores/forwarderShipments';
import type { SearchableOrder } from '$src/stores/searchableShipments';
import { searchableShipments } from '$src/stores/searchableShipments';
import type { ApiBoughtShipmentAccount } from '$src/utils/idl/boughtShipment';
import type { ApiShipmentAccount } from '$src/utils/idl/shipment';

import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

function loadFromStores(): {
	orders: ApiShipmentAccount[];
	boughtOrders: ApiBoughtShipmentAccount[];
} | null {
	const { data: shipments } = get(searchableShipments);
	const { data: boughtShipments } = get(searchableBoughtShipments);
	const len = shipments.length;

	if (len > 0) {
		return {
			orders: shipments.map(({ account, publicKey }) => {
				return {
					account,
					publicKey
				};
			}),
			boughtOrders: boughtShipments.map(({ account, publicKey }) => {
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
export async function load({
	fetch
}): Promise<{ orders: ApiShipmentAccount[]; boughtOrders: ApiBoughtShipmentAccount[] }> {
	console.log('loading shipments');
	const fromStores = loadFromStores();

	if (fromStores) {
		return fromStores;
	}

	try {
		const [fetchedOrders, fetchedBoughtOrders] = await Promise.all([
			fetch('/api/shipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}),
			// This may not be good idea to fetch it here, but for now it's fine
			fetch('/api/boughtShipments', {
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

		searchableShipments.default(searchableOrders);
		searchableBoughtShipments.default(searchableBoughtOrders);

		return { orders, boughtOrders };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
