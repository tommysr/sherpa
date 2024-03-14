import { anchorStore } from '$src/stores/anchor';
import { error, json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { ApiShipmentAccount, ShipmentAccount } from '$src/utils/idl/shipment';

export async function GET() {
	const { program } = get(anchorStore);

	let shipments: ShipmentAccount[] = await program.account.shipment.all();

	if (!shipments) {
		// status 500 for now, because we want to retry or cache orders
		throw error(500, 'No shipments found');
	}

	let apiShipments: ApiShipmentAccount[] = shipments.map(shipment => {
		return {
			...shipment,
			publicKey: shipment.publicKey.toString(),
			account: {
				...shipment.account,
				owner: shipment.account.owner.toString(),
				shipper: shipment.account.shipper.toString(),
				price: shipment.account.price.toNumber(),
				shipment: {
					...shipment.account.shipment,
					dimensions: {
						depth: shipment.account.shipment.dimensions.depth / 1000,
						height: shipment.account.shipment.dimensions.height / 1000,
						width: shipment.account.shipment.dimensions.width / 1000,
						weight: shipment.account.shipment.dimensions.weight / 1000,
					},
					when: (new Date(shipment.account.shipment.when.toNumber())).toISOString(),
					deadline: (new Date(shipment.account.shipment.deadline.toNumber())).toISOString(),
				}
			}
		}
	})


	return json(apiShipments);
}
