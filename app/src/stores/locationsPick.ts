import { LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';

export const pickedLocations = writable<{ src: LngLat; dst: LngLat }>({
	src: new LngLat(15.2, 50),
	dst: new LngLat(15, 50.2)
});
