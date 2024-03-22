import type { AcceptedShipmentOffer, ApiAcceptedShipmentOffer } from '../idl/acceptedOffer';
import { parseOfferDetails } from './offer';
import { parseShipmentDataToApiShipmentData } from './shipment';

export function parseAcceptedOfferToApiAcceptedOffer(
	acceptedOfferAccount: AcceptedShipmentOffer
): ApiAcceptedShipmentOffer {
	return {
		...acceptedOfferAccount,
		owner: acceptedOfferAccount.owner.toString(),
		accepted: acceptedOfferAccount.accepted.toNumber(),
		shipment: parseShipmentDataToApiShipmentData(acceptedOfferAccount.shipment),
		details: parseOfferDetails(acceptedOfferAccount.details)
	};
}
