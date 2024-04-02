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

	let wallets: Adapter[];
	// it's a solana devnet cluster, but consider changing it to more performant provider
	const network = clusterApiUrl('devnet');
	const localStorageKey = 'walletAdapter';

	onMount(async () => {
		wallets = [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new TrustWalletAdapter(),
			new Coin98WalletAdapter(),
			new LedgerWalletAdapter(),
			new TrezorWalletAdapter()
		];
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
