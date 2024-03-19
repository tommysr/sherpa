import type { PublicKey } from '@solana/web3.js';
import type BN from 'bn.js';
import type { BoughtShipment } from '../idl/boughtShipment';

export function parseBoughtShipmentToApiBoughtShipment(
	shipmentAcc: BoughtShipment<BN, BN, PublicKey>
): BoughtShipment<string, number, string> {
	return {
		...shipmentAcc,
		buyer: shipmentAcc.buyer.toString(),
		creator: shipmentAcc.creator.toString(),
		owner: shipmentAcc.owner.toString(),
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
