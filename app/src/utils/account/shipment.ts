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

export interface ShipmentData<BigNumber, Date, Name> {
	collateral: BigNumber;
	penalty: BigNumber;
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

export type Message = {
	value: number[]; // 256
}

export type Public = {
	value: number[];
};

export interface Shipment<ChannelPublicKey, ChannelMessage, Name, Date, BigNumber, Key> {
	shipper: Key;
	forwarder: Key;
	carrier: Key;
	price: BigNumber;
	name: Name;
	channel: Channel<ChannelPublicKey, ChannelMessage>;
	shipment: ShipmentData<BigNumber, Date, Name>;
	no: number;
	status: number;
	reserved: number[]; // 3
}

export type FetchedShipment = Shipment<Public, Message, AccountName, BN, BN, PublicKey>;
export type ParsedShipment = Shipment<number[], string, string, string, number, string>;

export type ShipmentAccount = ProgramAccount<FetchedShipment>;
export type ApiShipmentAccount = ApiProgramAccount<ParsedShipment>;
