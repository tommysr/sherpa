<!-- <script lang="ts">
	import { anchorStore } from '$src/stores/anchor';
	import { searchableBoughtShipments } from '$src/stores/forwarderShipments';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import type { ApiBoughtShipmentAccount, BoughtShipment } from '$src/utils/idl/boughtShipment';
	import type { ApiShipmentAccount, Shipment, ShipmentAccount } from '$src/utils/idl/shipment';
	import { parseBoughtShipmentToApiBoughtShipment } from '$src/utils/parse/boughtShipment';
	import { parseShipmentToApiShipment } from '$src/utils/parse/shipment';
	import type { PublicKey } from '@solana/web3.js';
	import type BN from 'bn.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	const { program } = get(anchorStore);

	function subscribeToShipmentEvents(): number[] {
		const unsubscribeShipmentCreated = program.addEventListener(
			'ShipmentCreated',
			async (event) => {
				console.log(event);
				const shipmentPublicKey = event.shipment;

				const shipment: Shipment<BN, BN, PublicKey> =
					await program.account.shipment.fetch(shipmentPublicKey);

				const parsedShipment: ApiShipmentAccount = {
					publicKey: shipmentPublicKey.toString(),
					account: parseShipmentToApiShipment(shipment)
				};

				searchableShipments.extend({
					...parsedShipment,
					searchParams: parsedShipment.account.shipment.details.priority.toString()
				});
			}
		);

		const unsubscribeShipmentBought = program.addEventListener(
			'ShipmentTransferred',
			async (event) => {
				console.log(event);

				const shipmentToRemove = event.before.toString();

				const shipmentBoughtPublicKey = event.after;

				const boughtShipment: BoughtShipment<BN, BN, PublicKey> =
					await program.account.boughtShipment.fetch(shipmentBoughtPublicKey);

				const parsedShipment: ApiBoughtShipmentAccount = {
					publicKey: shipmentBoughtPublicKey.toString(),
					account: parseBoughtShipmentToApiBoughtShipment(boughtShipment)
				};

				searchableBoughtShipments.extend({
					...parsedShipment,
					searchParams: parsedShipment.account.shipment.details.priority.toString()
				});

				const { data } = get(searchableShipments);
				const shipmentToRemoveIndex = data.findIndex(
					(shipment) => shipment.publicKey === shipmentToRemove
				);

				if (shipmentToRemoveIndex !== -1) {
					searchableShipments.shrink(shipmentToRemoveIndex);
				}
			}
		);

		return [unsubscribeShipmentBought, unsubscribeShipmentCreated];
	}

	onMount(() => {
		const unsubscribe = subscribeToShipmentEvents();
		return () => {
			for (const listener of unsubscribe) {
				program.removeEventListener(listener);
			}
		};
	});
</script>
-->
<slot />
