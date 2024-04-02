import type { PublicKey } from '@solana/web3.js';
import type BN from 'bn.js';
import type { ForwardedShipment } from '../account/forwardedShipment';

export function parseForwardedShipmentToApiForwardedShipment(
	shipmentAcc: ForwardedShipment<BN, PublicKey>
): ForwardedShipment<string, string> {
	return {
		...shipmentAcc,
		forwarder: shipmentAcc.forwarder.toString(),
		resellPrice: shipmentAcc.resellPrice.toString(),
		shipment: shipmentAcc.shipment.toString()
	};
}
