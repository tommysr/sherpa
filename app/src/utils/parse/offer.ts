import type { ShipmentOffer, ApiShipmentOffer } from '../idl/shipmentOffer';
import { parseShipmentDataToApiShipmentData } from './shipment';

export function parseOfferToApiOffer(carrierAccount: ShipmentOffer): ApiShipmentOffer {
	return {
		...carrierAccount,
		owner: carrierAccount.owner.toString(),
		submitted: carrierAccount.submitted.toNumber(),
		timeout: carrierAccount.timeout.toNumber(),
		shipment: parseShipmentDataToApiShipmentData(carrierAccount.shipment),
		details: {
			payment: carrierAccount.details.payment.toNumber(),
			collateral: carrierAccount.details.collateral.toNumber(),
			deadline: carrierAccount.details.deadline.toString()
		}
	};
}
