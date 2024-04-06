<script lang="ts">
	// sass
	import '$src/sass/main.scss';

	//svelte
	import { onMount } from 'svelte';

	//wallets adapters
	import type { Adapter } from '@solana/wallet-adapter-base';
	import {
		Coin98WalletAdapter,
		LedgerWalletAdapter,
		PhantomWalletAdapter,
		SolflareWalletAdapter,
		TrezorWalletAdapter,
		TrustWalletAdapter
	} from '@solana/wallet-adapter-wallets';
	//wallet components
	import AnchorConnectionProvider from '$src/components/Wallet/AnchorConnectionProvider.svelte';
	import ConnectionProvider from '$src/components/Wallet/ConnectionProvider.svelte';
	import WalletProvider from '$src/components/Wallet/WalletProvider.svelte';
	// solana
	import LeftNavbar from '$src/components/Navigation/LeftNavbar.svelte';
	import Notifications from '$src/components/Notification/Notifications.svelte';
	import MapWrapper from '$src/components/ShipmentMap/MapWrapper.svelte';
	import { clusterApiUrl } from '@solana/web3.js';
	import { userStore } from '$src/stores/user';
	import { walletStore } from '$src/stores/wallet';
	import { decodeName } from '$sdk/sdk';
	import { fetchForwarderAccount } from '$src/lib/forwarder';
	import { fetchShipperAccount } from '$src/lib/shipper';
	import { fetchCarrierAccount } from '$src/lib/carrier';
	import { get } from 'svelte/store';
	import { anchorStore } from '$src/stores/anchor';
	import type { ApiShipmentAccount, FetchedShipment } from '$src/utils/account/shipment';
	import { parseShipmentToApiShipment } from '$src/utils/parse/shipment';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import type {
		ApiForwardedShipmentAccount,
		FetchedForwardedShipment
	} from '$src/utils/account/forwardedShipment';
	import { parseForwardedShipmentToApiForwardedShipment } from '$src/utils/parse/forwardedShipment';
	import { forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
	import { createNotification, removeNotification } from '$src/components/Notification/notificationsStore';
	import { awaitedConfirmation } from '$src/stores/confirmationAwait';

	let wallets: Adapter[];
	// it's a solana devnet cluster, but consider changing it to more performant provider
	const network = clusterApiUrl('devnet');
	const localStorageKey = 'walletAdapter';
	const { program } = get(anchorStore);

	// check if user is registered as forwarder, shipper or carrier
	// this is done on wallet sign in/sign out, when user changes wallet
	$: if ($walletStore.publicKey) {

		fetchForwarderAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerForwarder(decodeName(account.name));
			}
		});

		fetchShipperAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerShipper(decodeName(account.name));
			}
		});

		fetchCarrierAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerCarrier(decodeName(account.name));
			}
		});
	} else {
		userStore.unregisterForwarder();
		userStore.unregisterShipper();
		userStore.unregisterCarrier();
	}

	function subscribeToShipmentEvents(): number[] {
		const unsubscribeShipmentCreated = program.addEventListener(
			'ShipmentCreated',
			async (event) => {
				console.log(event);
				const shipmentPublicKey = event.shipment;

				const shipment: FetchedShipment = await program.account.shipment.fetch(shipmentPublicKey);

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

		const unsubscribeForwardedShipment = program.addEventListener(
			'ShipmentTransferred',
			async (event) => {
				console.log(event.buyer.toString())
	
				const forwardedShipmentPublicKey = event.forwarded;

				const forwardedShipment: FetchedForwardedShipment =
					await program.account.forwardedShipment.fetch(forwardedShipmentPublicKey);

				const parsedShipment: ApiForwardedShipmentAccount = {
					publicKey: forwardedShipmentPublicKey.toString(),
					account: parseForwardedShipmentToApiForwardedShipment(forwardedShipment)
				};

				const buyer = event.buyer;

				if (buyer.toString() === $walletStore.publicKey?.toString())
				{
					const id = $awaitedConfirmation;
					if (id) {
						removeNotification(id)
					}
					createNotification({text: 'Purchase success', type: 'success', removeAfter: 5000})
				}

				forwardedShipmentsMeta.update((meta) => {
					meta.push(parsedShipment);
					return meta;
				});



				// TODO: change in searchableOrders

				// const { data } = get(searchableShipments);
				// const shipmentToRemoveIndex = data.findIndex(
				// 	(shipment) => shipment.publicKey === shipmentToRemove
				// );

				// if (shipmentToRemoveIndex !== -1) {
				// 	searchableShipments.shrink(shipmentToRemoveIndex);
				// }
			}
		);

		return [unsubscribeForwardedShipment, unsubscribeShipmentCreated];
	}


	onMount(() => {
		wallets = [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new TrustWalletAdapter(),
			new Coin98WalletAdapter(),
			new LedgerWalletAdapter(),
			new TrezorWalletAdapter()
		];

		const unsubscribe = subscribeToShipmentEvents();
		return () => {
			for (const listener of unsubscribe) {
				program.removeEventListener(listener);
			}
		};
	});
</script>

<AnchorConnectionProvider {network} />
<ConnectionProvider {network} />
<WalletProvider {localStorageKey} {wallets} autoConnect />

<Notifications>
	<LeftNavbar />

	<MapWrapper>
		<slot />
	</MapWrapper>
</Notifications>
