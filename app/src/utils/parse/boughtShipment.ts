import type { PublicKey } from '@solana/web3.js';
import type BN from 'bn.js';
import type { BoughtShipment } from '../idl/boughtShipment';
import { parseShipmentDataToApiShipmentData } from './shipment';

export function parseBoughtShipmentToApiBoughtShipment(
	shipmentAcc: BoughtShipment<BN, BN, PublicKey>
): BoughtShipment<string, number, string> {
	return {
		...shipmentAcc,
		buyer: shipmentAcc.buyer.toString(),
		creator: shipmentAcc.creator.toString(),
		owner: shipmentAcc.owner.toString(),
		shipment: parseShipmentDataToApiShipmentData(shipmentAcc.shipment)
	};
}
