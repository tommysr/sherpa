import type { ShipmentDetails, ShipmentDimensions } from '$src/utils/account/shipment';
import type { LngLat } from 'maplibre-gl';
import { get, writable } from 'svelte/store';
import { userStore } from './user';
import { createNotification } from '$src/components/Notification/notificationsStore';
import type Form from '$src/components/ShipmentForm/Form.svelte';

export enum FormStages {
	Name,
	Price,
	Dimensions,
	Details,
	Location,
	Summary
}
// Partial could make something bad in the future if there is no proper
// validation of object properties, so maybe provide some default values
interface FormInterface {
	price: number;
	location: Partial<{ from: LngLat; to: LngLat }>;
	currentStage: FormStages;
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
		currentStage: FormStages.Name,
		metrics: {
			weight: 'kg',
			distance: 'cm'
		},
		isMetricTon: false
	});

	const canPrev = (s: FormInterface) => {
		const {
			shipper: { registered }
		} = get(userStore);

		if (
			(registered && s.currentStage == FormStages.Price) ||
			(!registered && s.currentStage == FormStages.Name)
		) {
			return false;
		}

		return true;
	};

	const checkStageValidity = (s: FormInterface) => {
		switch (s.currentStage) {
			case FormStages.Name:
				const {
					shipper: { name }
				} = get(userStore);

				if (name && name.length > 1 && name.length < 65) {
					return;
				} else {
					throw 'name should be between 1 and 64 characters';
				}

			case FormStages.Price:
				if (s.price > 0) {
					return;
				} else {
					throw 'price should be greater than zero';
				}

			default:
				return;
		}
	};

	return {
		subscribe,
		set,
		checkStageValidity,

		refresh: () => {
			const {
				shipper: { registered }
			} = get(userStore);

			if (registered) {
				update((s) => {
					s.currentStage = FormStages.Price;

					return s;
				});
			}
		},

		nextStage: () => {
			update((s) => {
				try {
					checkStageValidity(s);
					s.currentStage += 1;
				} catch (err) {
					if (typeof err === 'string') {
						createNotification({
							text: err,
							type: 'failed',
							removeAfter: 3000
						});
					}
				}

				return s;
			});
		},

		canPrev,

		prevStage: () => {
			update((s) => {
				if (canPrev(s)) {
					s.currentStage -= 1;
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
				currentStage: FormStages.Name,
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
