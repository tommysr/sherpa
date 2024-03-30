<script lang="ts">
	import { page } from '$app/stores';
	import type { PublicKey } from '@solana/web3.js';
	import type BN from 'bn.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { decodeName } from '$sdk/sdk';

	import { fetchForwarderAccount } from '$src/lib/forwarder';

	import { anchorStore } from '$src/stores/anchor';
	import {
		searchableBoughtShipments,
		type SearchableBoughtOrder
	} from '$src/stores/forwarderShipments';
	import type { SearchStore } from '$src/stores/search';
	import { searchableShipments, type SearchableOrder } from '$src/stores/searchableShipments';
	import { userStore } from '$src/stores/user';
	import { walletStore } from '$src/stores/wallet';

	import type { ApiBoughtShipmentAccount, BoughtShipment } from '$src/utils/idl/boughtShipment';
	import type { ApiShipmentAccount, Shipment } from '$src/utils/idl/shipment';
	import { parseBoughtShipmentToApiBoughtShipment } from '$src/utils/parse/boughtShipment';
	import { parseShipmentToApiShipment } from '$src/utils/parse/shipment';

	type EitherSearchStore = SearchStore<SearchableOrder> | SearchStore<SearchableBoughtOrder>;
	let storeToSearchIn: EitherSearchStore = searchableShipments;
	let { program } = get(anchorStore);

	$: if ($walletStore.publicKey) {
		fetchForwarderAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerForwarder(decodeName(account.name));
			}
		});
	} else {
		userStore.unregisterForwarder();
	}

	$: pageUrl = $page.url.pathname;

	$: if (pageUrl == '/shipmentsMap') {
		storeToSearchIn = searchableShipments;
	} else if (pageUrl == '/shipmentsMap/bought') {
		storeToSearchIn = searchableBoughtShipments;
	}

	function handleSearchKeyUp(e: KeyboardEvent) {
		if ($storeToSearchIn.searchString && e.key == 'Enter') {
			storeToSearchIn.performSearch();
		} else if ($storeToSearchIn.searchString) {
			storeToSearchIn.purgeFiltered();
		}
	}

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

<div
	class="absolute z-10 w-3/4 md:w-1/3 xl:w-1/4 left-5 md:left-1/2 md:transform md:-translate-x-1/2 top-4"
>
	<div class="m-3 p-0.5 rounded-full bg-gradient-to-r from-primary to-secondary">
		<label for="name" class="sr-only">Name</label>
		<input
			class="px-3 py-1.5 w-full rounded-full bg-background focus:outline-none text-sm md:text-lg"
			type="text"
			id="name"
			placeholder="Search"
			bind:value={$storeToSearchIn.searchString}
			on:keyup={handleSearchKeyUp}
		/>
	</div>
</div>

<slot />
