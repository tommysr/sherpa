import type { PublicKey } from '@solana/web3.js';
import type { FetchedShipment, ParsedShipment, Public, Shipment, ShipmentData } from '../account/shipment';
import type { AccountName } from '../account/common';

import { decodeName } from '$sdk/sdk';
import type BN from 'bn.js';

export function parseShipmentDataToApiShipmentData(
	data: ShipmentData<BN, BN, AccountName>
): ShipmentData<number, string, string> {
	return {
		...data,
		geography: {
			...data.geography,
			fromName: decodeName(data.geography.fromName),
			toName: decodeName(data.geography.toName)
		},
		dimensions: {
			depth: data.dimensions.depth / 1000, // kgs
			height: data.dimensions.height / 1000, // meters
			width: data.dimensions.width / 1000, // meters
			weight: data.dimensions.weight / 1000 // meters
		},
		when: new Date(data.when.toNumber() * 1000).toISOString(),
		deadline: new Date(data.deadline.toNumber() * 1000).toISOString(),
		collateral: data.collateral.toNumber(),
		penalty: data.penalty.toNumber()
	};
}

export function parseShipmentToApiShipment(
	shipmentAcc: FetchedShipment
): ParsedShipment {
	return {
		...shipmentAcc,
		shipper: shipmentAcc.shipper.toString(),
		carrier: shipmentAcc.carrier.toString(),
		forwarder: shipmentAcc.forwarder.toString(),
		price: shipmentAcc.price.toNumber(),
		name: decodeName(shipmentAcc.name),
		channel: {
			carrier: shipmentAcc.channel.carrier.value,
			shipper:  shipmentAcc.channel.shipper.value,
			data: decodeName(shipmentAcc.channel.data)
		},
		shipment: parseShipmentDataToApiShipmentData(shipmentAcc.shipment)
	};
}
