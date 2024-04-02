import { PublicKey } from '@solana/web3.js';
import { type SearchStore } from './search';
import { searchableShipments, type SearchableShipment } from './searchableShipments';
import { derived, writable, type Writable } from 'svelte/store';
import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';
import type { ApiShipmentAccount } from '$src/utils/account/shipment';

// For now it isn't searchable
// but it should be in the future
//
// Now is suppose that only shipments are searchable
// and this store only holds forwarded shipments
// meta info only limiting the searches.
export const forwardedShipmentsMeta = writable<ApiForwardedShipmentAccount[]>([]);

export type ForwardedShipment = {
	meta: ApiForwardedShipmentAccount;
	shipment: ApiShipmentAccount;
};

export const forwardedShipments = derived<
	[SearchStore<SearchableShipment>, Writable<ApiForwardedShipmentAccount[]>],
	ForwardedShipment[]
>(
	[searchableShipments, forwardedShipmentsMeta],
	([$searchableShipments, $forwardedShipmentsMeta], set) => {
		const mapped = $forwardedShipmentsMeta
			.map((meta) => {
				const searchAddress = meta.account.forwarder;
				const shipment = $searchableShipments.filtered.find(
					(a) => a.account.forwarder === searchAddress
				);

				if (shipment !== undefined) {
					return { meta, shipment };
				} else {
					return null;
				}
			})
			.filter((item) => item !== null) as ForwardedShipment[];

		set(mapped);
	},
	[]
);
