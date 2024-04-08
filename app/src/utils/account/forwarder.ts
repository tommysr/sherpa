import type { BN, ProgramAccount } from '@coral-xyz/anchor';
import type { GeoLocation } from './shipment';
import type { ApiProgramAccount, AccountName } from './common';
import type { PublicKey } from '@solana/web3.js';


export interface ForwarderStruct<Key, Name> {
	creator: Key;
	authority: Key;
	name: Name;
	count: number;
}

export type Forwarder = ForwarderStruct<PublicKey, AccountName>;
export type ApiForwarder = ForwarderStruct<string, string>;

export type ForwarderAccount = ProgramAccount<Forwarder>;
export type ApiForwarderAccount = ApiProgramAccount<ApiForwarder>;
