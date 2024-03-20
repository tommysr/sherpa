import type { ShipmentDetails, ShipmentDimensions } from '$src/utils/idl/shipment';
import type { LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';

export enum FormStates {
	Main = 'main',
	Dimensions = 'dimensions',
	Properties = 'properties'
}
// Partial could make something bad in the future if there is no proper
// validation of object properties, so maybe provide some default values
interface FormInterface {
	price: number;
	location: Partial<{ from: LngLat; to: LngLat }>;
	currentState: FormStates;
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
		currentState: FormStates.Main,
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

		progressForm: () => {
			update((s) => {
				switch (s.currentState) {
					case FormStates.Main:
						s.currentState = FormStates.Dimensions;
						break;
					case FormStates.Dimensions:
						s.currentState = FormStates.Properties;
						break;
					case FormStates.Properties:
						s.currentState = FormStates.Main;
						break;
				}

				return s;
			});
		},
		regressForm: () => {
			update((s) => {
				switch (s.currentState) {
					case FormStates.Dimensions:
						s.currentState = FormStates.Main;
						break;
					case FormStates.Properties:
						s.currentState = FormStates.Dimensions;
						break;
				}

				return s;
			});
		},

		resetForm: () => {
			set({
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
				currentState: FormStates.Main,
				metrics: {
					weight: 'kg',
					distance: 'cm'
				},
				isMetricTon: false
			});
		}
	};
}

export let formStore = createFormStore();
