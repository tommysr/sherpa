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
	import {
		createNotification,
		removeNotification
	} from '$src/components/Notification/notificationsStore';
	import { awaitedConfirmation } from '$src/stores/confirmationAwait';
	import { web3Store } from '$src/stores/web3';

	let wallets: Adapter[];
	// it's a solana devnet cluster, but consider changing it to more performant provider
	const network = clusterApiUrl('devnet');
	const localStorageKey = 'walletAdapter';
	const { program } = get(anchorStore);
	const SOL_IN_LAMPORTS = 1000000000;
	const SHOULD_REQUEST_AIRDROP = false;
	$: isWalletConnected = $walletStore.publicKey !== null;

	const requiresAirdrop = async () => {
		const { connection } = get(web3Store);
		const { publicKey } = get(walletStore);

		const balance = await connection.getBalance(publicKey!);

		if (balance >= SOL_IN_LAMPORTS) {
			return false;
		}

		return true;
	};

	const airDropSol = async () => {
		const { connection } = get(web3Store);
		const { publicKey } = get(walletStore);

		const signature = await connection.requestAirdrop(publicKey!, SOL_IN_LAMPORTS);

		console.log(signature)

		const latestBlockHash = await connection.getLatestBlockhash();

		await connection.confirmTransaction({
			blockhash: latestBlockHash.blockhash,
			lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
			signature
		});

		return signature;
	};


	$: if (isWalletConnected && SHOULD_REQUEST_AIRDROP) {
		requiresAirdrop().then((res) => {
			if (res) {
				airDropSol().then((signature) => {
					createNotification({ text: 'airdrop', type: 'success', removeAfter: 5000, signature })
				}).catch(() => {
					createNotification({ text: 'airdrop', type: 'failed', removeAfter: 3000 });
				})
			}
		});
	}

	// check if user is registered as forwarder, shipper or carrier
	// this is done on wallet sign in/sign out, when user changes wallet
	$: if ($walletStore.publicKey) {
		fetchForwarderAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerForwarder(decodeName(account.name), accountKey.toString());
			}
		});

		fetchShipperAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerShipper(decodeName(account.name), accountKey.toString());
			}
		});

		fetchCarrierAccount(program, $walletStore.publicKey).then(({ account, accountKey }) => {
			if (account) {
				userStore.registerCarrier(decodeName(account.name), accountKey.toString());
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
				const shipmentPublicKey = event.shipment;

				const shipment: FetchedShipment = await program.account.shipment.fetch(shipmentPublicKey);

				const parsedShipment: ApiShipmentAccount = {
					publicKey: shipmentPublicKey.toString(),
					account: parseShipmentToApiShipment(shipment)
				};

				const shipper = event.shipper;

				if ($walletStore.publicKey && shipper.toString() === $walletStore.publicKey.toString()) {
					const id = $awaitedConfirmation;
					if (id) {
						removeNotification(id);
					}
					createNotification({ text: 'Create', type: 'success', removeAfter: 5000 });
				}

				searchableShipments.extend({
					...parsedShipment,
					searchParams: parsedShipment.account.shipment.details.priority.toString()
				});
			}
		);

		const unsubscribeForwardedShipment = program.addEventListener(
			'ShipmentTransferred',
			async (event) => {
				const forwardedShipmentPublicKey = event.forwarded;

				const forwardedShipment: FetchedForwardedShipment =
					await program.account.forwardedShipment.fetch(forwardedShipmentPublicKey);

				const parsedForwardedShipment: ApiForwardedShipmentAccount = {
					publicKey: forwardedShipmentPublicKey.toString(),
					account: parseForwardedShipmentToApiForwardedShipment(forwardedShipment)
				};

				const buyer = event.buyer;

				if ($walletStore.publicKey && buyer.toString() === $walletStore.publicKey.toString()) {
					const id = $awaitedConfirmation;
					if (id) {
						removeNotification(id);
					}
					createNotification({ text: 'Buy', type: 'success', removeAfter: 5000 });
				}

				forwardedShipmentsMeta.update((meta) => {
					meta.push(parsedForwardedShipment);
					return meta;
				});

				searchableShipments.update(s => {
					const shipmentIndex = s.data.findIndex(a => a.publicKey === event.shipment.toString())

					const shipmentToChange = s.data[shipmentIndex];
					shipmentToChange.account.status = 2;
					shipmentToChange.account.forwarder = event.buyer.toString();

					return s;
				})
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
