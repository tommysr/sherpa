import { writable } from 'svelte/store';

interface UserInterface {
	shipper: {
		registered: boolean;
		name: string;
	};
	forwarder: {
		registered: boolean;
		name: string;
	};
	carrier: {
		registered: boolean;
		name: string;
	};
}

export function createUserStore() {
	const { subscribe, set, update } = writable<UserInterface>({
		shipper: { registered: false, name: '' },
		forwarder: { registered: false, name: '' },
		carrier: { registered: false, name: '' }
	});

	return {
		subscribe,
		registerForwarder: (name: string) => {
			update((store) => {
				store.forwarder.registered = true;
				store.forwarder.name = name;

				return store;
			});
		},

		registerShipper: (name: string) => {
			update((store) => {
				store.shipper.registered = true;
				store.shipper.name = name;

				return store;
			});
		},

		unregisterForwarder: () => {
			update((store) => {
				store.forwarder.registered = false;
				store.forwarder.name = '';

				return store;
			});
		},

		unregisterShipper: () => {
			update((store) => {
				store.shipper.registered = false;
				store.shipper.name = '';

				return store;
			});
		}
	};
}

export let userStore = createUserStore();
