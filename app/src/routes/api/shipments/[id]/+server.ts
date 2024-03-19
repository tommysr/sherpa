import type { MockTransportOrder } from '$src/utils/types/mockTransport';
import { generateMockTransportOrders } from '../mockUtils.js';

export async function GET({ params }) {
	// TODO: get data from anchor using anchor store, then parse it and return to client

	const ordersFetched: MockTransportOrder[] = generateMockTransportOrders(10);

	const ordersParsed = JSON.stringify(ordersFetched);

	return new Response(ordersParsed, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
