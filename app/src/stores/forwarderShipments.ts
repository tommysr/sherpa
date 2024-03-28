import type { ApiBoughtShipmentAccount } from '$src/utils/idl/boughtShipment';
import { createSearchStore, type SearchItem } from './search';

export type SearchableBoughtOrder = ApiBoughtShipmentAccount & SearchItem;
export const searchableBoughtShipments = createSearchStore<SearchableBoughtOrder>([]);
