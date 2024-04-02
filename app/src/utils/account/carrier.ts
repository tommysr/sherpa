import type { BN, ProgramAccount } from '@coral-xyz/anchor';
import type { GeoLocation } from './shipment';
import type { ApiProgramAccount, AccountName } from './common';
import type { PublicKey } from '@solana/web3.js';

export interface Availability<Time, Name> {
	time: Time;
	location: GeoLocation;
	locationName: Name;
}

export interface Carrier<Date, Key, Name> {
	creator: Key;
	authority: Key;
	name: Name;
	availability: Availability<Date, Name>;
	offersCount: number;
	tasksCount: number;
}

export type CarrierAccount = ProgramAccount<Carrier<BN, PublicKey, AccountName>>;
export type ApiCarrierAccount = ApiProgramAccount<Carrier<string, string, string>>;
