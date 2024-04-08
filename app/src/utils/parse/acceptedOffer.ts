import type { AcceptedShipmentOffer, ApiAcceptedShipmentOffer } from '../account/acceptedOffer';
import { parseOfferDetails } from './offer';


export function parseAcceptedOfferToApiAcceptedOffer(
	acceptedOfferAccount: AcceptedShipmentOffer
): ApiAcceptedShipmentOffer {
	return {
		...acceptedOfferAccount,
		owner: acceptedOfferAccount.owner.toString(),
		accepted: new Date(acceptedOfferAccount.accepted.toNumber() * 1000).toISOString(),
		shipment: acceptedOfferAccount.shipment.toString(),
		details: parseOfferDetails(acceptedOfferAccount.details)
	};
}