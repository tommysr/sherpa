import { PublicKey } from '@solana/web3.js';
import { type SearchStore } from './search';
import { searchableShipments, type SearchableShipment } from './searchableShipments';
import { derived, writable, type Writable } from 'svelte/store';
import type { ApiForwardedShipmentAccount } from '$src/utils/account/forwardedShipment';
import type { ApiShipmentAccount } from '$src/utils/account/shipment';
import type { ApiShipmentOfferAccount } from '$src/utils/account/offer';

// For now it isn't searchable
// but it should be in the future
//
// Now is suppose that only shipments are searchable
// and this store only holds forwarded shipments
// meta info only limiting the searches.
export const shipmentsOffersMeta = writable<ApiShipmentOfferAccount[]>([]);

export type OfferedShipment = {
	meta: ApiShipmentOfferAccount;
	shipment: ApiShipmentAccount;
};

export const shipmentOffers = derived<
	[SearchStore<SearchableShipment>, Writable<ApiShipmentOfferAccount[]>],
	OfferedShipment[]
>(
	[searchableShipments, shipmentsOffersMeta],
	([$searchableShipments, $shipmentsOffersMeta], set) => {
		const mapped = $shipmentsOffersMeta
			.map((meta) => {
				const searchAddress = meta.account.offeror;
				const shipment = $searchableShipments.filtered.find(
					(a) => a.account.forwarder === searchAddress
				);

				if (shipment !== undefined) {
					return { meta, shipment };
				} else {
					return null;
				}
			})
			.filter((item) => item !== null) as OfferedShipment[];

		set(mapped);
	},
	[]
);
