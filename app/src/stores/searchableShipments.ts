import type { ApiShipmentAccount } from '$src/utils/idl/shipment';
import { createSearchStore, type SearchItem } from './search';

export type SearchableOrder = ApiShipmentAccount & SearchItem;

export const searchableShipments = createSearchStore<SearchableOrder>([]);
