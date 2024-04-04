import type { ApiCarrier, Carrier } from '../account/carrier';
import { decodeName } from '$sdk/sdk';

export function parseCarrierToApiCarrier(
	carrierAccount: Carrier
): ApiCarrier {
	return {
		...carrierAccount,
		authority: carrierAccount.authority.toString(),
		creator: carrierAccount.creator.toString(),
		name: decodeName(carrierAccount.name),
		availability: {
			...carrierAccount.availability,
			locationName: decodeName(carrierAccount.availability.locationName),
			time: new Date(carrierAccount.availability.time.toNumber()).toISOString()
		}
	};
}
