import type BN from 'bn.js';
import type { ShipmentData } from './shipment';
import type { PublicKey } from '@solana/web3.js';
import type { ProgramAccount } from '@coral-xyz/anchor';
import type { ApiProgramAccount } from './account';
import type { OfferDetails } from './shipmentOffer';

export interface AcceptedShipmentOfferStruct<Date, BigNumber, Key, U64MAX> {
	owner: Key;
	details: OfferDetails<BigNumber, U64MAX>;
	shipment: ShipmentData<Date>;
	accepted: BigNumber;
	no: number;
	reserved: number[];
}

export type AcceptedShipmentOffer = AcceptedShipmentOfferStruct<BN, BN, PublicKey, BN>;
export type ApiAcceptedShipmentOffer = AcceptedShipmentOfferStruct<string, number, string, string>;
export type AcceptedShipmentOfferAccount = ProgramAccount<AcceptedShipmentOffer>;
export type ApiAcceptedShipmentOfferAccount = ApiProgramAccount<ApiAcceptedShipmentOffer>;
