import type { ShipmentDetails, ShipmentDimensions } from '$src/utils/idl/shipment';
import type { LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';

// Partial could make something bad in the future if there is no proper
// validation of object properties, so maybe provide some default values
interface FormInterface {
	price: number;
	location: Partial<{ from: LngLat; to: LngLat }>;
	nextState: string;
	dates: {
		when: Date;
		deadline: Date;
	};
	dimensions: ShipmentDimensions;
	details: ShipmentDetails;
	metrics: {
		weight: string;
		distance: string;
	};
	isMetricTon: boolean;
}

export function createFormStore() {
	const { subscribe, set, update } = writable<FormInterface>({
		price: 0.01,
		dates: {
			when: new Date(),
			deadline: new Date()
		},
		details: {
			access: 0,
			count: 1,
			fragility: 0,
			priority: 0,
			reserved: [0, 0, 0, 0]
		},
		dimensions: {
			height: 0,
			width: 0,
			depth: 0,
			weight: 0
		},
		location: {},
		nextState: 'dimensions',
		metrics: {
			weight: 'kg',
			distance: 'cm'
		},
		isMetricTon: false
	});

	return {
		subscribe,
		set,
		update,

		changeNextState: () => {
			update((s) => {
				if (s.nextState == 'dimensions') {
					s.nextState = 'properties';
				} else if (s.nextState == 'properties') {
					s.nextState = 'submit';
				}

				return s;
			});
		}
	};
}

export let formStore = createFormStore();
