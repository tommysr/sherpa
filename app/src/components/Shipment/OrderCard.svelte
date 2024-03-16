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
	import { getForwarderAddress, getShipperAddress } from '$src/lib/addresses';
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

	async function handleBuyOrder(e: Event): Promise<string> {
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
				shipper: getShipperAddress(program, new PublicKey(shipmentData.shipper)),
				shipment: new PublicKey(shipmentAccount.publicKey),
				forwarder,
				signer: wallet.publicKey!
			})
			.instruction();

		tx.add(ix);
		const sig = await useSignAndSendTransaction(connection, wallet, tx);
		return sig;
	}

	async function getLocationFromCoords(lat: number, long: number): Promise<string> {
		return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
		// const response = await fetch(
		// 	`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`
		// );
		// const data = await response.json();

		// console.log(data.address);
		// if (data.address.village) {
		// 	return data.address.village;
		// } else if (data.address.city && data.address.city_district) {
		// 	return `${data.address.city}, ${data.address.city_district}`;
		// } else {
		// 	throw Error('No location found');
		// }
	}
</script>

<Card>
	<svelte:fragment slot="first-info">
		<h3>{shipmentData.price / 10 ** 9} SOL</h3>
	</svelte:fragment>
	<svelte:fragment slot="second-info">
		{@const len = locations.length}

		{#each locations as [location, value], index}
			<!-- TODO: batching or keep locations on server -->
			{#await getLocationFromCoords(value.latitude, value.longitude)}
				<article aria-busy="true"></article>
			{:then location}
				{location}
			{:catch error}
				{value.latitude.toFixed(4)} {value.longitude.toFixed(4)}
			{/await}

			{#if index != len - 1}
				{'→ '}
			{/if}
		{/each}
	</svelte:fragment>

	<svelte:fragment slot="third-info">
		{@const len = dimensions.length}
		{#each dimensions as [dimension, value], index}
			{dimension[0]}: {value}

			<!-- TODO: add these on blockchain, would be nice to have some objects 
			representing different properties -->
			{#if index == len - 1}
				kg
			{:else}
				m
			{/if}

			{#if index == len - 2}
				<br />
			{/if}
		{/each}

		<!--  -->
	</svelte:fragment>
	<svelte:fragment slot="fourth-info">
		<button slot="footer" class="contrast" on:click={() => (isBuyClicked = !isBuyClicked)}>
			Buy
		</button>
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<span>Date: {new Date(shipmentData.shipment.when).toDateString()}</span>
		<span>Deadline: {new Date(shipmentData.shipment.deadline).toDateString()}</span>
	</svelte:fragment>
</Card>

<CancelConfirmModal bind:isModalOpen={isBuyClicked} confirmClickHandler={handleBuyOrder}>
	<h4 slot="header">Check your order</h4>
	<svelte:fragment slot="body">
		<article>
			<header>Main factors</header>

			<p>Price: {shipmentData.price / 10 ** 9}</p>
			<p>Shipper address: {shipmentData.shipper.toString()}</p>
			<p>Owner address: {shipmentData.owner.toString()}</p>
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
