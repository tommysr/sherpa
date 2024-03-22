import type { BN, ProgramAccount } from '@coral-xyz/anchor';
import type { GeoLocation } from './shipment';
import type { ApiProgramAccount } from './account';
import type { PublicKey } from '@solana/web3.js';

export interface Availability<Time> {
	time: Time;
	location: GeoLocation;
}

export type AccountName = {
	value: number[];
};

export interface CarrierStruct<Date, Key, Name> {
	creator: Key;
	authority: Key;
	name: Name;
	availability: Availability<Date>;
	offersCount: number;
	tasksCount: number;
}

export type Carrier = CarrierStruct<BN, PublicKey, AccountName>;
export type ApiCarrier = CarrierStruct<string, string, string>;

export type CarrierAccount = ProgramAccount<Carrier>;
export type ApiCarrierAccount = ApiProgramAccount<ApiCarrier>;
