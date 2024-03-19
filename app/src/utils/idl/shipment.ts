import type { ProgramAccount, BN } from '@coral-xyz/anchor';
import type { PublicKey } from '@solana/web3.js';
import type { ApiProgramAccount } from './account';

export interface ShipmentDetails {
	count: number;
	priority: number;
	fragility: number;
	access: number;
	reserved: number[];
}

export interface ShipmentDimensions {
	weight: number;
	width: number;
	height: number;
	depth: number;
}

export interface GeoLocation {
	latitude: number;
	longitude: number;
}

export interface Geography {
	from: GeoLocation;
	to: GeoLocation;
}

export interface ShipmentData<D> {
	geography: Geography;
	details: ShipmentDetails;
	dimensions: ShipmentDimensions;
	when: D;
	deadline: D;
}

export interface Shipment<Date, Price, Key> {
	owner: Key;
	shipper: Key;
	price: Price;
	no: number;
	reserved: number[];
	shipment: ShipmentData<Date>;
}

export type ShipmentAccount = ProgramAccount<Shipment<BN, BN, PublicKey>>;
export type ApiShipmentAccount = ApiProgramAccount<Shipment<string, number, string>>;
