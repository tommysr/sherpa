import { getAcceptedOfferAddresses, getCarrierAddress } from '$sdk/sdk';
import type {
	AcceptedShipmentOffer,
	ApiAcceptedShipmentOfferAccount
} from '$src/utils/account/acceptedOffer';

import type { Protocol } from '$src/utils/idl/types/protocol';
import { parseAcceptedOfferToApiAcceptedOffer } from '$src/utils/parse/acceptedOffer';
import type { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export const fetchAcceptedOffersAccountsFor = async (
	program: Program<Protocol>,
	carrier: PublicKey
) => {
	const carrierAccount = await program.account.carrier.fetchNullable(
		getCarrierAddress(program, carrier)
	);

	if (!carrierAccount) {
		throw 'Carrier not found';
	}

	const acceptedOfferAddresses = getAcceptedOfferAddresses(
		program,
		carrier,
		carrierAccount.tasksCount
	);

	const offers: (AcceptedShipmentOffer | null)[] =
		await program.account.acceptedOffer.fetchMultiple(acceptedOfferAddresses);

	const apiAcceptedOfferAccounts: ApiAcceptedShipmentOfferAccount[] = offers.flatMap((offer, i) => {
		if (offer) {
			return {
				account: parseAcceptedOfferToApiAcceptedOffer(offer),
				publicKey: acceptedOfferAddresses[i].toString()
			};
		} else {
			return [];
		}
	});

	return apiAcceptedOfferAccounts;
};