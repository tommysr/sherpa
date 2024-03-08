import type { MockTransportOrder } from '$src/utils/types/mockTransport';

// Generate an array of MockTransportOrder objects [Github Copilot]
export function generateMockTransportOrders(numOrders: number): MockTransportOrder[] {
	const mockTransportOrders: MockTransportOrder[] = [];

	for (let i = 0; i < numOrders; i++) {
		const mockOrder: MockTransportOrder = {
			name: 'item' + i.toString(),
			price: Math.random() * 1000,
			from: {
				latitude: Math.random() * 90,
				longitude: Math.random() * 180
			},
			to: {
				latitude: Math.random() * 90,
				longitude: Math.random() * 180
			},
			dimensions: {
				weight: Math.random() * 1000,
				volume: Math.random() * 100
			},
			when: Date.now(), // Example timestamp, replace with actual timestamp
			details: {
				priority: Math.floor(Math.random() * 5) + 1, // Random priority from 1 to 5
				fragility: Math.random(),
				reserved: Array.from({ length: Math.floor(Math.random() * 5) }, (_, index) => index + 1) // Random array of reserved slots
			}
		};

		mockTransportOrders.push(mockOrder);
	}

	return mockTransportOrders;
}
