import type BN from 'bn.js';
import type { ShipmentOffer, ApiShipmentOffer, OfferDetails } from '../account/offer';


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
		offeror: offerAccount.offeror.toString(),
		submitted: offerAccount.submitted.toNumber(),
		timeout: offerAccount.timeout.toNumber(),
		shipment: offerAccount.shipment.toString(),
		details: parseOfferDetails(offerAccount.details)
	};
}