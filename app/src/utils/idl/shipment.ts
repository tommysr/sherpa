import type { ProgramAccount, BN } from '@coral-xyz/anchor';
import type { PublicKey } from '@solana/web3.js';

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

export interface ShipmentData {
	geography: Geography;
	details: ShipmentDetails;
	dimensions: ShipmentDimensions;
	when: BN;
	deadline: BN;
}

interface Shipment {
	owner: PublicKey;
	shipper: PublicKey;
	price: BN;
	no: number;
	reserved: number[];
	shipment: ShipmentData;
}

export type ShipmentAccount = ProgramAccount<Shipment>;
