import { forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

function loadFromStores(): {
	forwardedShipments: ApiForwardedShipmentAccount[];
} | null {
	const forwardedShipments = get(forwardedShipmentsMeta);
	const len = forwardedShipments.length;

	if (len > 0) {
		return {
			forwardedShipments
		};
	} else {
		return null;
	}
}

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{
	forwardedShipments: ApiForwardedShipmentAccount[];
}> {
	console.log('loading shipments');
	const fromStores = loadFromStores();

	if (fromStores) {
		return fromStores;
	}

	try {
		const fetchedForwardedShipments = await 
			fetch('/api/forwardedShipments', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});

		const forwardedShipments: ApiForwardedShipmentAccount[] = 
 await fetchedForwardedShipments.json();


		forwardedShipmentsMeta.set(forwardedShipments);

		return { forwardedShipments };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
