import type { ShipmentDimensions } from '$src/utils/idl/shipment';
import type { LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';


// Partial could make something bad in the future if there is no proper 
// validation of object properties, so maybe provide some default values
interface FormInterface {
	price?: number;
	location: Partial<{ from: LngLat; to: LngLat }>;
	nextState: string;
	when?: Date;
	deadline?: Date;
	dimensions: Partial<ShipmentDimensions>;
	weightMetrics: string;
	distanceMetrics: string;
	isMetricTon: boolean;
}

export function createFormStore() {
	const { subscribe, set, update } = writable<FormInterface>({
		price: 0.01,
		location: {},
		dimensions: {},
		nextState: 'dimensions',
		weightMetrics: 'kg',
		distanceMetrics: 'cm',
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
