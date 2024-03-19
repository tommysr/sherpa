import type { PublicKey } from '@solana/web3.js';
import type { Shipment } from '../idl/shipment';
import type BN from 'bn.js';

export function parseShipmentToApiShipment(
	shipmentAcc: Shipment<BN, BN, PublicKey>
): Shipment<string, number, string> {
	return {
		...shipmentAcc,
		owner: shipmentAcc.owner.toString(),
		shipper: shipmentAcc.shipper.toString(),
		price: shipmentAcc.price.toNumber(),
		shipment: {
			...shipmentAcc.shipment,
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
