import type { AcceptedShipmentOffer, ApiAcceptedShipmentOffer } from '../account/acceptedOffer';
import { parseOfferDetails } from './offer';


export function parseAcceptedOfferToApiAcceptedOffer(
	acceptedOfferAccount: AcceptedShipmentOffer
): ApiAcceptedShipmentOffer {
	return {
		...acceptedOfferAccount,
		owner: acceptedOfferAccount.owner.toString(),
		accepted: acceptedOfferAccount.accepted.toNumber(),
		shipment: acceptedOfferAccount.shipment.toString(),
		details: parseOfferDetails(acceptedOfferAccount.details)
	};
}