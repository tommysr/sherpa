import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { ApiShipmentAccount, ShipmentAccount } from '$src/utils/account/shipment';
import { parseShipmentToApiShipment } from '$src/utils/parse/shipment';

export async function GET() {
	const { program } = get(anchorStore);

	let shipments: ShipmentAccount[] = await program.account.shipment.all();

	if (!shipments) {
		// status 500 for now, because we want to retry or cache orders
		throw error(500, 'No shipments found');
	}

	let apiShipments: ApiShipmentAccount[] = shipments.map((shipment) => {
		return {
			...shipment,
			publicKey: shipment.publicKey.toString(),
			account: parseShipmentToApiShipment(shipment.account)
		};
	});

	return json(apiShipments);
}
