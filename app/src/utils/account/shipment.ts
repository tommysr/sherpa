import type { ProgramAccount, BN } from '@coral-xyz/anchor';
import type { PublicKey } from '@solana/web3.js';
import type { ApiProgramAccount, AccountName } from './common';

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

export interface Geography<Name> {
	from: GeoLocation;
	fromName: Name;
	to: GeoLocation;
	toName: Name;
}

export interface ShipmentData<Date, Name> {
	geography: Geography<Name>;
	details: ShipmentDetails;
	dimensions: ShipmentDimensions;
	when: Date;
	deadline: Date;
}

export interface Channel<Public, Message> {
	shipper: Public;
	carrier: Public;
	data: Message;
}

export type Public<Inner> = {
	value: Inner[];
};

export interface Shipment<Public, ChannelData, Name, Date, Price, Key> {
	shipper: Key;
	forwarder: Key;
	carrier: Key;
	price: Price;
	name: Name;
	channel: Channel<Public, ChannelData>;
	shipment: ShipmentData<Date, Name>;
	no: number;
	reserved: number[];
}

export type FetchedShipment = Shipment<Public<BN>, AccountName, AccountName, BN, BN, PublicKey>;
export type ParsedShipment = Shipment<string, string, string, string, number, string>;

export type ShipmentAccount = ProgramAccount<FetchedShipment>;
export type ApiShipmentAccount = ApiProgramAccount<ParsedShipment>;
