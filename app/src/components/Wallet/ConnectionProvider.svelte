<script lang="ts">
	import { Connection } from '@solana/web3.js';
	import type { Commitment, ConnectionConfig } from '@solana/web3.js';
	import { web3Store } from '$src/stores/web3';

	export let network: string,
		config: Commitment | ConnectionConfig | undefined = 'processed';

	const connection = new Connection(network, config);
	web3Store.set({ connection });
</script>
