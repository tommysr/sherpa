<script lang="ts">
	// CONSIDER: this scss file import some picocss stylesheets and
	// pico overrides the default styles of some components like button, input, etc.
	// so, it's ruining the default styles of components like Map

	// sass
	import '$src/sass/main.scss';

	//svelte
	import { onMount } from 'svelte';

	//wallets adapters
	import type { Adapter } from '@solana/wallet-adapter-base';
	import {
		LedgerWalletAdapter,
		PhantomWalletAdapter,
		TrezorWalletAdapter,
		TrustWalletAdapter
	} from '@solana/wallet-adapter-wallets';
	//wallet components
	import AnchorConnectionProvider from '$src/components/Wallet/AnchorConnectionProvider.svelte';
	import ConnectionProvider from '$src/components/Wallet/ConnectionProvider.svelte';
	import WalletProvider from '$src/components/Wallet/WalletProvider.svelte';
	// solana
	import { clusterApiUrl } from '@solana/web3.js';

	let wallets: Adapter[];
	// it's a solana devnet cluster, but consider changing it to more performant provider
	const network = clusterApiUrl('devnet');
	const localStorageKey = 'walletAdapter';

	onMount(async () => {
		wallets = [
			new PhantomWalletAdapter(),
			new TrustWalletAdapter(),
			new LedgerWalletAdapter(),
			new TrezorWalletAdapter()
		];
	});
</script>

<AnchorConnectionProvider {network} />
<ConnectionProvider {network} />
<WalletProvider {localStorageKey} {wallets} autoConnect />
<!-- <Navbar /> -->
<slot />
