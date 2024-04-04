import type { PublicKey } from '@solana/web3.js';
import type { Public, Shipment, ShipmentData } from '../account/shipment';
import type { AccountName } from '../account/common';

import { decodeName } from '$sdk/sdk';
import type BN from 'bn.js';

export function parseShipmentDataToApiShipmentData(data: ShipmentData<BN, AccountName>): ShipmentData<string, string> {
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
			when: new Date(data.when.toNumber()).toISOString(),
			deadline: new Date(data.deadline.toNumber()).toISOString()
	};
}

export function parseShipmentToApiShipment(
	shipmentAcc: Shipment<Public<BN>, AccountName, AccountName, BN, BN, PublicKey>
): Shipment<string, string, string, string, number, string> {
	return {
		...shipmentAcc,
		// : shipmentAcc.owner.toString(),
		shipper: shipmentAcc.shipper.toString(),
		carrier: shipmentAcc.carrier.toString(),
		forwarder: shipmentAcc.forwarder.toString(),
		price: shipmentAcc.price.toNumber(),
		name: decodeName(shipmentAcc.name),
		channel: {
			carrier: shipmentAcc.channel.carrier.value[0].toString(),
			shipper: shipmentAcc.channel.shipper.value[0].toString(),
			data: decodeName(shipmentAcc.channel.data).toString()
		},
		shipment: parseShipmentDataToApiShipmentData(shipmentAcc.shipment)
	};
}
