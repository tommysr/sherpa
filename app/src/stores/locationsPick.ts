import { LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';

export const defaultLocation = new LngLat(15, 50);

export const pickedLocations = writable<{ src: LngLat; dst: LngLat }>({
	src: defaultLocation,
	dst: defaultLocation
});
