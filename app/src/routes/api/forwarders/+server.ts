import { anchorStore } from '$src/stores/anchor';
import type { ApiForwarderAccount, Forwarder, ForwarderAccount } from '$src/utils/account/forwarder';
import { parseForwarderToApiForwarder } from '$src/utils/parse/forwarder';
import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';


export async function GET() {
	const { program } = get(anchorStore);

	let forwarders: ForwarderAccount[] = await program.account.forwarder.all();

	let apiCarriers: ApiForwarderAccount[] = forwarders.map((forwarder) => {
		return {
			...forwarder,
			publicKey: forwarder.publicKey.toString(),
			account: parseForwarderToApiForwarder(forwarder.account)
		};
	});

	return json(apiCarriers);
}