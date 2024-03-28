import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type {
	ForwardedShipmentAccount,
	ApiForwardedShipmentAccount
} from '$src/utils/account/forwardedShipment';
import { parseForwardedShipmentToApiForwardedShipment } from '$src/utils/parse/forwardedShipment';

export async function GET() {
	const { program } = get(anchorStore);

	let shipments: ForwardedShipmentAccount[] = await program.account.forwardedShipment.all();

	if (!shipments) {
		// status 500 for now, because we want to retry or cache orders
		throw error(500, 'No bought shipments found');
	}

	let apiShipments: ApiForwardedShipmentAccount[] = shipments.map((shipment) => {
		return {
			...shipment,
			publicKey: shipment.publicKey.toString(),
			account: parseForwardedShipmentToApiForwardedShipment(shipment.account)
		};
	});

	return json(apiShipments);
}
