import type { BN, ProgramAccount } from '@coral-xyz/anchor';
import type { ApiProgramAccount } from './account';
import type { ShipmentData } from './shipment';
import type { PublicKey } from '@solana/web3.js';

export interface BoughtShipment<Date, Price, Key> {
	creator: Key;
	buyer: Key;
	owner: Key;
	no: number;
	reserved: number[];
	shipment: ShipmentData<Date>;
}

export type BoughtShipmentAccount = ProgramAccount<BoughtShipment<BN, BN, PublicKey>>;
export type ApiBoughtShipmentAccount = ApiProgramAccount<BoughtShipment<string, number, string>>;
