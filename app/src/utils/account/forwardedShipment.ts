import type { BN, ProgramAccount } from '@coral-xyz/anchor';
import type { ApiProgramAccount } from './common';
import type { PublicKey } from '@solana/web3.js';

export interface ForwardedShipment<Price, Key> {
	forwarder: Key;
	shipment: Key;
	resellPrice: Price;
	no: number;
	reserved: number[]; //4
}

export type FetchedForwardedShipment = ForwardedShipment<BN, PublicKey>;
export type ParsedForwardedShipment = ForwardedShipment<string, string>;

export type ForwardedShipmentAccount = ProgramAccount<FetchedForwardedShipment>;
// string because someone set it to u64 MAX;
export type ApiForwardedShipmentAccount = ApiProgramAccount<ParsedForwardedShipment>;
