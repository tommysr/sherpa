import type { ApiShipmentAccount } from '$src/utils/account/shipment';
import { derived, readable } from 'svelte/store';
import { createSearchStore, type SearchItem, type SearchStore } from './search';
import { PublicKey } from '@solana/web3.js';

export type SearchableShipment = ApiShipmentAccount & SearchItem;

export const searchableShipments = createSearchStore<SearchableShipment>([]);

export const notForwardedShipments = derived<SearchStore<SearchableShipment>, ApiShipmentAccount[]>(
	searchableShipments,
	($searchableShipments, set) => {
		const mapped = $searchableShipments.filtered.filter(
			(a) => a.account.forwarder === PublicKey.default.toString()
		);

		set(mapped);
	},
	[]
);
