import type { PublicKey } from '@solana/web3.js';
import type { Public, Shipment } from '../account/shipment';
import type { AccountName } from '../account/common';

import { decodeKey, decodeName } from '$sdk/sdk';
import type BN from 'bn.js';

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
			carrier: decodeKey(shipmentAcc.channel.carrier).toString(),
			shipper: decodeKey(shipmentAcc.channel.shipper).toString(),
			data: decodeName(shipmentAcc.channel.data).toString()
		},
		shipment: {
			...shipmentAcc.shipment,
			geography: {
				...shipmentAcc.shipment.geography,
				fromName: decodeName(shipmentAcc.shipment.geography.fromName),
				toName: decodeName(shipmentAcc.shipment.geography.toName)
			},
			dimensions: {
				depth: shipmentAcc.shipment.dimensions.depth / 1000,
				height: shipmentAcc.shipment.dimensions.height / 1000,
				width: shipmentAcc.shipment.dimensions.width / 1000,
				weight: shipmentAcc.shipment.dimensions.weight / 1000
			},
			when: new Date(shipmentAcc.shipment.when.toNumber()).toISOString(),
			deadline: new Date(shipmentAcc.shipment.deadline.toNumber()).toISOString()
		}
	};
}
