import type { PublicKey } from '@solana/web3.js';
import type { Shipment, ShipmentData } from '../idl/shipment';
import type BN from 'bn.js';

export function parseShipmentDataToApiShipmentData(data: ShipmentData<BN>): ShipmentData<string> {
	return {
		...data,
		dimensions: {
			depth: data.dimensions.depth / 1000,
			height: data.dimensions.height / 1000,
			width: data.dimensions.width / 1000,
			weight: data.dimensions.weight / 1000
		},
		when: new Date(data.when.toNumber()).toISOString(),
		deadline: new Date(data.deadline.toNumber()).toISOString()
	};
}

export function parseShipmentToApiShipment(
	shipmentAcc: Shipment<BN, BN, PublicKey>
): Shipment<string, number, string> {
	return {
		...shipmentAcc,
		owner: shipmentAcc.owner.toString(),
		shipper: shipmentAcc.shipper.toString(),
		price: shipmentAcc.price.toNumber(),
		shipment: parseShipmentDataToApiShipmentData(shipmentAcc.shipment)
	};
}
