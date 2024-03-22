import type BN from 'bn.js';
import type { ShipmentOffer, ApiShipmentOffer, OfferDetails } from '../idl/shipmentOffer';
import { parseShipmentDataToApiShipmentData } from './shipment';

export function parseOfferDetails(details: OfferDetails<BN, BN>): OfferDetails<number, string> {
	return {
		payment: details.payment.toNumber(),
		collateral: details.collateral.toNumber(),
		deadline: details.deadline.toString()
	};
}

export function parseOfferToApiOffer(offerAccount: ShipmentOffer): ApiShipmentOffer {
	return {
		...offerAccount,
		owner: offerAccount.owner.toString(),
		submitted: offerAccount.submitted.toNumber(),
		timeout: offerAccount.timeout.toNumber(),
		shipment: parseShipmentDataToApiShipmentData(offerAccount.shipment),
		details: parseOfferDetails(offerAccount.details)
	};
}
