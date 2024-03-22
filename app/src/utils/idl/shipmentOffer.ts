import type BN from 'bn.js';
import type { ShipmentData } from './shipment';
import type { PublicKey } from '@solana/web3.js';

// u64 max cause someone set deadline to u64 max
export interface OfferDetails<BigNumber, U64MAX> {
	payment: BigNumber;
	collateral: BigNumber;
	deadline: U64MAX;
}

export interface ShipmentOfferStruct<Date, BigNumber, Key, U64MAX> {
	owner: Key;
	details: OfferDetails<BigNumber, U64MAX>;
	shipment: ShipmentData<Date>;
	submitted: BigNumber;
	timeout: BigNumber;
	no: number;
	shipmentNo: number;
}

export type ShipmentOffer = ShipmentOfferStruct<BN, BN, PublicKey, BN>;
export type ApiShipmentOffer = ShipmentOfferStruct<string, number, string, string>;
