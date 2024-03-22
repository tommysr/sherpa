import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { parseOfferToApiOffer } from '$src/utils/parse/offer';
import { PublicKey } from '@solana/web3.js';
import { getCarrierAddress, getOfferAddresses } from '$sdk/sdk.js';
import type { ApiShipmentOffer, ShipmentOffer } from '$src/utils/idl/shipmentOffer.js';

export async function GET({ params }) {
	const { program } = get(anchorStore);

	const carrierAccount = await program.account.carrier.fetchNullable(
		getCarrierAddress(program, new PublicKey(params.carrier))
	);

	if (!carrierAccount) {
		throw error(404, 'Carrier not found');
	}

	const offerAddresses = getOfferAddresses(
		program,
		new PublicKey(params.carrier),
		carrierAccount.offersCount
	);

	const offers: (ShipmentOffer | null)[] =
		await program.account.shipmentOffer.fetchMultiple(offerAddresses);

	const apiOfferAccounts: ApiShipmentOffer[] = offers.flatMap((offer) => {
		if (offer) {
			return parseOfferToApiOffer(offer);
		} else {
			return [];
		}
	});

	return json(apiOfferAccounts);
}
