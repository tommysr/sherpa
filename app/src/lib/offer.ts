import { getCarrierAddress, getOfferAddresses } from '$sdk/sdk';
import type { ApiShipmentOfferAccount, ShipmentOffer } from '$src/utils/idl/shipmentOffer';
import type { Protocol } from '$src/utils/idl/types/protocol';
import { parseOfferToApiOffer } from '$src/utils/parse/offer';
import type { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export const fetchOffersAccountsFor = async (program: Program<Protocol>, carrier: PublicKey) => {
	const carrierAccount = await program.account.carrier.fetchNullable(
		getCarrierAddress(program, carrier)
	);

	if (!carrierAccount) {
		throw 'Carrier not found';
	}

	const offerAddresses = getOfferAddresses(program, carrier, carrierAccount.offersCount);

	const offers: (ShipmentOffer | null)[] =
		await program.account.shipmentOffer.fetchMultiple(offerAddresses);

	const apiOfferAccounts: ApiShipmentOfferAccount[] = offers.flatMap((offer, i) => {
		if (offer) {
			return {
				account: parseOfferToApiOffer(offer),
				publicKey: offerAddresses[i].toString()
			};
		} else {
			return [];
		}
	});

	return apiOfferAccounts;
};
