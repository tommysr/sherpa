import { anchorStore } from '$src/stores/anchor';
import type { MockTransportOrder } from '$src/utils/types/mockTransport';
import { error, json } from '@sveltejs/kit';
import { generateMockTransportOrders } from './mockUtils';
import { get } from 'svelte/store';

export async function GET() {
	const { program } = get(anchorStore);

	let shipments = await program.account.shipment.all();

	console.log(shipments);

	if (!shipments) {
		// status 500 for now, because we want to retry or cache orders
		throw error(500, 'No shipments found');
	}

	return json(shipments);
}
