import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { ShipmentAccount } from '$src/utils/idl/shipment';
import { decodeIdlAccount } from '@coral-xyz/anchor/dist/cjs/idl';

export async function GET() {
	const { program } = get(anchorStore);

	let shipments: ShipmentAccount[] = await program.account.shipment.all();

	if (!shipments) {
		// status 500 for now, because we want to retry or cache orders
		throw error(500, 'No shipments found');
	}

	return json(shipments);
}
