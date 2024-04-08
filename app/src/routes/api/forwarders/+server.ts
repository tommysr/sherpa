// import { anchorStore } from '$src/stores/anchor';
// import { json } from '@sveltejs/kit';
// import { get } from 'svelte/store';


// export async function GET() {
// 	const { program } = get(anchorStore);

// 	let forwarders: ForwarderAccount[] = await program.account.forwarder.all();

// 	let apiCarriers: ApiForwarderAccount[] = forwarders.map((forwarder) => {
// 		return {
// 			...forwarder,
// 			publicKey: forwarder.publicKey.toString(),
// 			account: parseFowarderToApiFowarder(forwarder.account)
// 		};
// 	});

// 	return json(apiCarriers);
// }