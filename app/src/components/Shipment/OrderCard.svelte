<script lang="ts">
	import { anchorStore } from '$src/stores/anchor';
	import type {
		Shipment,
		ShipmentDimensions,
		GeoLocation,
		Geography,
		ShipmentDetails,
		ApiShipmentAccount
	} from '$src/utils/idl/shipment';
	import { get } from 'svelte/store';
	import CancelConfirmModal from './CancelConfirmModal.svelte';
	import Card from './Card.svelte';
	import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
	import { getForwarderAddress } from '$src/lib/addresses';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';

	type Entries<T> = {
		[K in keyof T]: [K, T[K]];
	}[keyof T][];

	export let shipmentAccount: ApiShipmentAccount;

	$: shipmentData = shipmentAccount.account;
	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	$: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	let isBuyClicked: boolean = false;

	async function registerForwarderIx(forwarder: PublicKey): Promise<TransactionInstruction> {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		const registerShipperIx = await program.methods
			.registerForwarder()
			.accounts({
				forwarder,
				signer: wallet.publicKey!
			})
			.instruction();

		return registerShipperIx;
	}

	async function handleBuyOrder(e: Event) {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);
		const forwarder = getForwarderAddress(program, wallet?.publicKey!);
		const forwarderAccount = await program.account.forwarder.fetchNullable(forwarder);
		const tx = new Transaction();

		if (!forwarderAccount) {
			const registerIx = await registerForwarderIx(forwarder);
			tx.add(registerIx);
		}

		const ix = await program.methods
			.buyShipment()
			.accounts({
				shipper: new PublicKey(shipmentData.shipper),
				shipment: new PublicKey(shipmentAccount.publicKey),
				forwarder: new PublicKey(forwarder)
			})
			.instruction();

		tx.add(ix);
		const sig = await useSignAndSendTransaction(connection, wallet, tx);
		console.log(sig);
	}
</script>

<Card>
	<svelte:fragment slot="first-info">
		<h2>Price</h2>
		{shipmentData.price / 10 ** 9}
		<h4>Deadline</h4>
		{new Date(shipmentData.shipment.deadline).toDateString()}
		<h4>When</h4>
		{new Date(shipmentData.shipment.when).toDateString()}
	</svelte:fragment>
	<svelte:fragment slot="second-info">
		<h4>Dimensions</h4>
		<!-- looking to rendering some box to make it cute -->
		{#each dimensions as [dimension, value]}
			<p>{dimension}: {value}</p>
		{/each}
	</svelte:fragment>

	<svelte:fragment slot="third-info">
		<h4>Location</h4>
		<!-- i would like to show only some place from an api taking long and lat in and then in some subroute show all the information -->
		{#each locations as [location, value]}
			<p>{location}: {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}</p>
		{/each}
	</svelte:fragment>

	<button slot="footer" class="contrast" on:click={() => (isBuyClicked = !isBuyClicked)}>
		Buy
	</button>
</Card>

<CancelConfirmModal bind:isModalOpen={isBuyClicked} on:confirmed={handleBuyOrder}>
	<h4 slot="header">Check your order</h4>
	<svelte:fragment slot="body">
		<article>
			<header>Main factors</header>

			<p>Price: {shipmentData.price / 10 ** 9}</p>
			<p>Shipper address: {shipmentData.shipper.toString()}</p>
			<p>When: {new Date(shipmentData.shipment.when).toDateString()}</p>
			<p>Deadline: {new Date(shipmentData.shipment.deadline).toDateString()}</p>
		</article>

		<article>
			<header>Dimensions</header>

			{#each dimensions as [dimension, value]}
				<p>{dimension}: {value}</p>
			{/each}
		</article>

		<article>
			<header>Location</header>

			{#each locations as [location, value]}
				<p>{location}: {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}</p>
			{/each}
		</article>

		<article>
			<header>Properties</header>
			{#each properties as [location, value]}
				<p>{location}: {value}</p>
			{/each}
		</article>
	</svelte:fragment>
</CancelConfirmModal>
