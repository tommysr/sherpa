import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type {
	ApiBoughtShipmentAccount,
	BoughtShipmentAccount
} from '$src/utils/idl/boughtShipment';
import { parseBoughtShipmentToApiBoughtShipment } from '$src/utils/parse/boughtShipment';

export async function GET() {
	const { program } = get(anchorStore);

	let shipments: BoughtShipmentAccount[] = await program.account.boughtShipment.all();

	if (!shipments) {
		// status 500 for now, because we want to retry or cache orders
		throw error(500, 'No bought shipments found');
	}

	let apiShipments: ApiBoughtShipmentAccount[] = shipments.map((shipment) => {
		return {
			...shipment,
			publicKey: shipment.publicKey.toString(),
			account: parseBoughtShipmentToApiBoughtShipment(shipment.account)
		};
	});

	return json(apiShipments);
}
