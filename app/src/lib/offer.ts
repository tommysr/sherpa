import {
	getAcceptedOfferAddress,
	getCarrierAddress,
	getForwarderAddress,
	getOfferAddress,
	getOfferAddresses
} from '$sdk/sdk';
import type { ApiShipmentOfferAccount, ShipmentOffer } from '$src/utils/account/offer';
import type { Protocol } from '$src/utils/idl/types/protocol';
import { parseOfferToApiOffer } from '$src/utils/parse/offer';
import type { Program } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

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

export const getAcceptShipmentOfferTx = async (
	program: Program<Protocol>,
	signer: PublicKey,
	forwarderAuthority: PublicKey,
	shipment: PublicKey,
	offerNo: number
): Promise<Transaction> => {
	const carrier = getCarrierAddress(program, signer);
	const carrierAccount = await program.account.carrier.fetchNullable(carrier);

	if (!carrierAccount) {
		throw 'Carrier account not found';
	}

	const offer = getOfferAddress(program, signer, offerNo);
	const task = getAcceptedOfferAddress(program, signer, carrierAccount.tasksCount);
	const forwarder = getForwarderAddress(program, forwarderAuthority);

	const ix = await program.methods
		.acceptOffer()
		.accounts({
			carrier,
			shipment,
			forwarder,
			offer,
			task,
			signer,
			payer: signer
		})
		.instruction();

	return new Transaction().add(ix);
};
