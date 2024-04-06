
import { fetchAcceptedOffersAccountsFor } from '$src/lib/acceptedOffer';
import { fetchOffersAccountsFor } from '$src/lib/offer';
import { anchorStore } from '$src/stores/anchor';
import { PublicKey } from '@solana/web3.js';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';

export async function GET({ params: { carrier } }) {
	const { program } = get(anchorStore);
	const carrierPubkey = new PublicKey(carrier);

	try {
		const [offers, acceptedOffers] = await Promise.all([
			fetchOffersAccountsFor(program, carrierPubkey),
			fetchAcceptedOffersAccountsFor(program, carrierPubkey)
		]);

		return json({ offers, acceptedOffers });
	} catch (err) {
		if (typeof err === 'string') {
			throw error(404, err);
		} else {
			throw error(500, 'unknown error');
		}
	}
}