import { writable } from 'svelte/store';

interface UserInterface {
	shipper: {
		registered: boolean;
		name: string | null;
		key: string | null;
	};
	forwarder: {
		registered: boolean;
		name: string | null;
		key: string | null;
	};
	carrier: {
		registered: boolean;
		name: string | null;
		key: string | null;
	};
}

export function createUserStore() {
	const { subscribe, set, update } = writable<UserInterface>({
		shipper: { registered: false, name: null, key: null },
		forwarder: { registered: false, name: null, key: null },
		carrier: { registered: false, name: null, key: null }
	});

	return {
		set,
		subscribe,
		registerForwarder: (name: string, key: string) => {
			update((store) => {
				store.forwarder.registered = true;
				store.forwarder.name = name;
				store.forwarder.key = key;

				return store;
			});
		},

		registerShipper: (name: string, key: string) => {
			update((store) => {
				store.shipper.registered = true;
				store.shipper.name = name;
				store.shipper.key = key;

				return store;
			});
		},

		registerCarrier: (name: string, key: string) => {
			update((store) => {
				store.carrier.registered = true;
				store.carrier.name = name;
				store.carrier.key = key;

				return store;
			});
		},

		unregisterForwarder: () => {
			update((store) => {
				store.forwarder.registered = false;
				store.forwarder.name = null;
				store.forwarder.key = null;


				return store;
			});
		},

		unregisterShipper: () => {
			update((store) => {
				store.shipper.registered = false;
				store.shipper.name = null;
				store.shipper.key = null;

				return store;
			});
		},

		unregisterCarrier: () => {
			update((store) => {
				store.carrier.registered = false;
				store.carrier.name = null;
				store.carrier.key = null;

				return store;
			});
		}
	};
}

export let userStore = createUserStore();
