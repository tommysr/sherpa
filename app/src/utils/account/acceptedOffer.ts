import type BN from 'bn.js';
import type { ShipmentData } from './shipment';
import type { PublicKey } from '@solana/web3.js';
import type { ProgramAccount } from '@coral-xyz/anchor';
import type { ApiProgramAccount } from './common'
import type { OfferDetails } from './offer';

export interface AcceptedShipmentOfferStruct<Date, BigNumber, Key, U64MAX> {
	owner: Key;
	shipment: Key;
	details: OfferDetails<BigNumber, U64MAX>;
	accepted: Date;
	no: number;
	reserved: number[]; // 4
}

export type AcceptedShipmentOffer = AcceptedShipmentOfferStruct<BN, BN, PublicKey, BN>;
export type ApiAcceptedShipmentOffer = AcceptedShipmentOfferStruct<string, number, string, string>;
export type AcceptedShipmentOfferAccount = ProgramAccount<AcceptedShipmentOffer>;
export type ApiAcceptedShipmentOfferAccount = ApiProgramAccount<ApiAcceptedShipmentOffer>;