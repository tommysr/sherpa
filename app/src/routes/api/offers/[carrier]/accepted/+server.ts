import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { PublicKey } from '@solana/web3.js';
import { fetchAcceptedOffersAccountsFor } from '$src/lib/acceptedOffer.js';

export async function GET({ params: { carrier } }) {
	const { program } = get(anchorStore);
	const carrierPubkey = new PublicKey(carrier);

	try {
		const apiOfferAccounts = await fetchAcceptedOffersAccountsFor(program, carrierPubkey);

		return json(apiOfferAccounts);
	} catch (err) {
		if (typeof err === 'string') {
			throw error(404, err);
		} else {
			throw error(500, 'unknown error');
		}
	}
}
