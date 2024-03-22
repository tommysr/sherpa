import type { ApiShipmentOffer, ApiShipmentOfferAccount } from '$src/utils/idl/shipmentOffer';
import { createSearchStore, type SearchItem } from './search';

export type SearchableShipmentOffer = ApiShipmentOfferAccount & SearchItem;
export const searchableShipmentOffers = createSearchStore<SearchableShipmentOffer>([]);
