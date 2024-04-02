import type { BN, ProgramAccount } from '@coral-xyz/anchor';
import type { GeoLocation } from './shipment';
import type { ApiProgramAccount, AccountName } from './common';
import type { PublicKey } from '@solana/web3.js';

export interface Availability<Time> {
	time: Time;
	location: GeoLocation;
}

export interface Carrier<Date, Key, Name> {
	creator: Key;
	authority: Key;
	name: Name;
	availability: Availability<Date>;
	offersCount: number;
	tasksCount: number;
}

export type CarrierAccount = ProgramAccount<Carrier<BN, PublicKey, AccountName>>;
export type ApiCarrierAccount = ApiProgramAccount<Carrier<string, string, string>>;
