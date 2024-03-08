<script lang="ts">
	// sass
	import '$src/sass/main.scss';

	//svelte
	import { onMount } from 'svelte';

	//wallets adapters
	import type { Adapter } from '@solana/wallet-adapter-base';
	import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

	//wallet components
	import AnchorConnectionProvider from '$src/components/Wallet/AnchorConnectionProvider.svelte';
	import ConnectionProvider from '$src/components/Wallet/ConnectionProvider.svelte';
	import WalletProvider from '$src/components/Wallet/WalletProvider.svelte';
	import Navbar from '$src/components/Navigation/Navbar.svelte';

	// solana
	import { clusterApiUrl } from '@solana/web3.js';

	let wallets: Adapter[];
	const network = clusterApiUrl('devnet');
	const localStorageKey = 'walletAdapter';

	onMount(async () => {
		wallets = [new PhantomWalletAdapter()];
	});
</script>

<AnchorConnectionProvider {network} />
<ConnectionProvider {network} />
<WalletProvider {localStorageKey} {wallets} autoConnect />
<Navbar />

<slot />
