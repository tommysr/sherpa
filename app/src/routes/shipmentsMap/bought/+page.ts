import type { ApiCarrierAccount } from '$src/utils/account/carrier';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad } */
export async function load({ fetch }): Promise<{ carriers: ApiCarrierAccount[] }> {
	try {
		const fetchedCarriers = await fetch('/api/carriers', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const carriers: ApiCarrierAccount[] = await fetchedCarriers.json();

		return { carriers };
	} catch {
		throw error(404, 'Not found');
	}
}
