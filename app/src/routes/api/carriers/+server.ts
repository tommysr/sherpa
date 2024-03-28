import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type { ApiCarrierAccount, CarrierAccount } from '$src/utils/idl/carrier';
import { parseCarrierToApiCarrier } from '$src/utils/parse/carrier';

export async function GET() {
	const { program } = get(anchorStore);

	let carriers: CarrierAccount[] = await program.account.carrier.all();

	if (!carriers) {
		// status 500 for now, because we want to retry or cache carriers
		throw error(500, 'No carriers found');
	}

	let apiCarriers: ApiCarrierAccount[] = carriers.map((carrier) => {
		return {
			...carrier,
			publicKey: carrier.publicKey.toString(),
			account: parseCarrierToApiCarrier(carrier.account)
		};
	});

	return json(apiCarriers);
}
