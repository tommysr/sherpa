import type { ApiCarrierAccount } from '$src/utils/account/carrier';
import type { ApiForwarderAccount } from '$src/utils/account/forwarder.js';

import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({
	fetch
}): Promise<{ carriers: ApiCarrierAccount[]; forwarders: ApiForwarderAccount[] }> {
	try {
		const [fetchedForwarders, fetchCarriers] = await Promise.all([
			fetch('/api/forwarders', {
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
			})
		]);

		const [forwarders, carriers] = await Promise.all<
			[Promise<ApiForwarderAccount[]>, Promise<ApiCarrierAccount[]>]
		>([fetchedForwarders.json(), fetchCarriers.json()]);

		return { carriers, forwarders };
	} catch {
		throw error(404, 'Not found');
	}
}

export const ssr = false;
