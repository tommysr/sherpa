<script lang="ts">
	import { page } from '$app/stores';
	import { decodeName } from '$sdk/sdk';
	import MapWrapper from '$src/components/ShipmentMap/MapWrapper.svelte';
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';
	import { fetchForwarderAccount } from '$src/lib/forwarder';
	import { anchorStore } from '$src/stores/anchor';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import { userStore } from '$src/stores/user';
	import { walletStore } from '$src/stores/wallet';
	import { get } from 'svelte/store';

	const { program } = get(anchorStore);
	let storeToSearchIn = searchableShipments;

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

	function handleSearchKeyUp(e: KeyboardEvent) {
		if ($storeToSearchIn.searchString && e.key == 'Enter') {
			storeToSearchIn.performSearch();
		} else if ($storeToSearchIn.searchString) {
			storeToSearchIn.purgeFiltered();
		}
	}

	// function subscribeToShipmentEvents(): number[] {
	// 	const unsubscribeShipmentCreated = program.addEventListener(
	// 		'ShipmentCreated',
	// 		async (event) => {
	// 			console.log(event);
	// 			const shipmentPublicKey = event.shipment;

	// 			const shipment: FetchedShipment = await program.account.shipment.fetch(shipmentPublicKey);

	// 			const parsedShipment: ApiShipmentAccount = {
	// 				publicKey: shipmentPublicKey.toString(),
	// 				account: parseShipmentToApiShipment(shipment)
	// 			};

	// 			searchableShipments.extend({
	// 				...parsedShipment,
	// 				searchParams: parsedShipment.account.shipment.details.priority.toString()
	// 			});
	// 		}
	// 	);

	// const unsubscribeShipmentBought = program.addEventListener(
	// 	'ShipmentTransferred',
	// 	async (event) => {
	// 		const shipmentToRemove = event.before.toString();

	// 		const forwardedShipmentPublicKey = event.after;

	// 		const forwardedShipment: FetchedForwardedShipment =
	// 			await program.account.forwardedShipment.fetch(forwardedShipmentPublicKey);

	// 		const parsedShipment: ApiForwardedShipmentAccount = {
	// 			publicKey: forwardedShipmentPublicKey.toString(),
	// 			account: parseForwardedShipmentToApiForwardedShipment(forwardedShipment)
	// 		};

	// 		searchableBoughtShipments.extend({
	// 			...parsedShipment,
	// 			searchParams: parsedShipment.account.shipment.details.priority.toString()
	// 		});

	// 		const { data } = get(searchableShipments);
	// 		const shipmentToRemoveIndex = data.findIndex(
	// 			(shipment) => shipment.publicKey === shipmentToRemove
	// 		);

	// 		if (shipmentToRemoveIndex !== -1) {
	// 			searchableShipments.shrink(shipmentToRemoveIndex);
	// 		}
	// 	}
	// );

	// return [unsubscribeShipmentBought, unsubscribeShipmentCreated];

	// 	return [unsubscribeShipmentCreated];
	// }

	// onMount(() => {
	// 	const unsubscribe = subscribeToShipmentEvents();
	// 	return () => {
	// 		for (const listener of unsubscribe) {
	// 			program.removeEventListener(listener);
	// 		}
	// 	};
	// });
</script>

<main class="relative h-screen w-full overflow-hidden">
	<div class="absolute z-10 w-3/4 md:w-1/3 xl:w-1/4 left-1/2 transform -translate-x-1/2 top-4">
		<div class="m-3 p-0.5 rounded-full bg-gradient-to-r from-primary to-secondary">
			<label for="name" class="sr-only">Name</label>
			<input
				class="px-3 py-1.5 w-full rounded-full bg-background focus:outline-none text-sm lg:text-md"
				type="text"
				id="name"
				placeholder="Search"
				bind:value={$storeToSearchIn.searchString}
				on:keyup={handleSearchKeyUp}
			/>
		</div>
	</div>
	<div class="hidden md:block absolute top-7 right-7 z-40">
		<WalletMultiButton onClose={() => {}} />
	</div>

	<div class="hidden md:block">
		<MapWrapper>
			<slot />
		</MapWrapper>
	</div>

	<div class="md:hidden">
		<MapWrapper>
			<slot />
		</MapWrapper>
	</div>
</main>
