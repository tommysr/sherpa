import { writable } from 'svelte/store';

export interface WalletModalStore {
	isDropdownVisible: boolean;
	isModalVisible: boolean;
}

function createWalletModalStore() {
	const { subscribe, update } = writable<WalletModalStore>({
		isModalVisible: false,
		isDropdownVisible: false
	});

	return {
		subscribe,
		openModal: () => {
			update((store) => {
				store.isModalVisible = true;
				return store;
			});
		},
		closeModal: () => {
			update((store) => {
				store.isModalVisible = false;
				return store;
			});
		},
		openDropdown: () => {
			update((store) => {
				store.isDropdownVisible = true;
				return store;
			});
		},
		closeDropdown: () => {
			update((store) => {
				store.isDropdownVisible = false;
				return store;
			});
		}
	};
}

export const walletModalStore = createWalletModalStore();
