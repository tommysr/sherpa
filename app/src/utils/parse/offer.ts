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
		submitted: new Date(offerAccount.submitted.toNumber() * 1000).toISOString(),
		timeout: new Date(offerAccount.timeout.toNumber() * 1000).toISOString(),
		shipment: offerAccount.shipment.toString(),
		details: parseOfferDetails(offerAccount.details)
	};
}

