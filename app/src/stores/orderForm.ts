import type { LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';

interface FormInterface {
	price?: number;
	location: Partial<{ from: LngLat; to: LngLat }>;
	state: string;
	when?: Date;
	deadline?: Date;
}

export function createFormStore() {
	const { subscribe, set, update } = writable<FormInterface>({
		price: 0.01,
		location: {},
		state: 'Dimensions'
	});

	return {
		subscribe,
		set,
		update
	};
}

export let formStore = createFormStore();
