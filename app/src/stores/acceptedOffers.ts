import { PublicKey } from '@solana/web3.js';
import { type SearchStore } from './search';
import { searchableShipments, type SearchableShipment } from './searchableShipments';
import { derived, writable, type Writable } from 'svelte/store';
import type { ApiShipmentAccount } from '$src/utils/account/shipment';
import type { ApiShipmentOfferAccount } from '$src/utils/account/offer';
import type { ApiAcceptedShipmentOfferAccount } from '$src/utils/account/acceptedOffer';

// For now it isn't searchable
// but it should be in the future
//
// Now is suppose that only shipments are searchable
// and this store only holds forwarded shipments
// meta info only limiting the searches.
export const acceptedShipmentsOffersMeta = writable<ApiAcceptedShipmentOfferAccount[]>([]);

export type AcceptedShipment = {
	meta: ApiAcceptedShipmentOfferAccount;
	shipment: ApiShipmentAccount;
};

export const acceptedShipmentOffers = derived<
	[SearchStore<SearchableShipment>, Writable<ApiAcceptedShipmentOfferAccount[]>],
	AcceptedShipment[]
>(
	[searchableShipments, acceptedShipmentsOffersMeta],
	([$searchableShipments, $acceptedShipmentsOffersMeta], set) => {
		const mapped = $acceptedShipmentsOffersMeta
			.map((meta) => {
				const searchAddress = meta.account.shipment;
				const shipment = $searchableShipments.filtered.find(
					(a) => a.publicKey == searchAddress
				);

				if (shipment !== undefined) {
					return { meta, shipment };
				} else {
					return null;
				}
			})
			.filter((item) => item !== null) as AcceptedShipment[];

		set(mapped);
	},
	[]
);
