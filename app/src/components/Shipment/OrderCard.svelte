<script lang="ts">
	import { encodeName, getForwarderAddress, getShipperAddress } from '$sdk';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import type {
		ApiShipmentAccount,
		Geography,
		ShipmentDetails,
		ShipmentDimensions
	} from '$src/utils/idl/shipment';
	import type { Entries } from '$src/utils/types/object';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
	import { get } from 'svelte/store';
	import CancelConfirmModal from './CancelConfirmModal.svelte';
	import NameModal from './NameModal.svelte';

	export let shipmentAccount: ApiShipmentAccount;

	$: shipmentData = shipmentAccount.account;
	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	$: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	let isBuyClicked: boolean = false;

	let nameModal: NameModal;
	let isNameModalOpen: boolean = false;

	async function registerForwarderIx(
		forwarder: PublicKey,
		name: string
	): Promise<TransactionInstruction> {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);

		const registerShipperIx = await program.methods
			.registerForwarder(encodeName(name))
			.accounts({
				forwarder,
				signer: wallet.publicKey!
			})
			.instruction();

		return registerShipperIx;
	}

	async function waitForName(): Promise<string> {
		return new Promise<string>((resolve) => {
			nameModal.$on('name', (e: CustomEvent<Event> & { detail: string }) => {
				resolve(e.detail);
			});
		});
	}

	async function handleBuyOrder(e: Event): Promise<string> {
		console.log('elo');
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);

		// TODO: handle it
		// if (!wallet.publicKey) {
		// 	alert('Wallet not connected');
		// 	return '';
		// }

		const forwarder = getForwarderAddress(program, wallet?.publicKey!);

		const forwarderAccount = await program.account.forwarder.fetchNullable(forwarder);
		const tx = new Transaction();

		if (!forwarderAccount) {
			console.log('opening modal');
			isNameModalOpen = true;
			console.log('waiting for name');
			const name = await waitForName();
			console.log(name);
			const registerIx = await registerForwarderIx(forwarder, name);
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
		// there are limits, only 1per sec, so caching is needed or some better provider.
		return `Kraków, Poland`;
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

<div
	class="grid grid-cols-3 gap-x-4 gap-y-2 w-full place-items-center mb-8 rounded-lg pb-5 bg-primary-50 shadow-lg border-2 border-gray-200"
>
	<!-- <div
		class="col-span-3 w-full text-white rounded-lg bg-gradient-to-r from-primary to-secondary py-0.5"
	></div> -->
	<div class="col-span-3 my-4">
		<h2
			class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
		>
			{shipmentData.price / 10 ** 9} SOL
		</h2>
	</div>

	<div
		class="col-span-3 grid grid-cols-3 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="">When</div>
		<div class="">Deadline</div>
		<div class="">Priority</div>
	</div>

	<div>
		<span>{new Date(shipmentData.shipment.when).toLocaleDateString()}</span>
	</div>
	<div>
		<span>{new Date(shipmentData.shipment.deadline).toLocaleDateString()}</span>
	</div>
	<div>
		<span>High</span>
	</div>

	<div
		class="col-span-3 grid items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div class="col-span-3">Locations</div>
	</div>

	<div class="col-span-3">
		{#if locations}
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
		{:else}
			<p>No location</p>
		{/if}
	</div>

	<div
		class="col-span-3 grid grid-cols-3 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
	>
		<div>Weight</div>
		<div class="col-span-2">Depth x Height x Width</div>
	</div>

	<div>
		{#if dimensions}
			{dimensions[3][1]} kg
		{:else}
			<p>No dimensions</p>
		{/if}
	</div>
	<div class="col-span-2">
		{#if dimensions}
			{dimensions[0][1]} x {dimensions[1][1]} x {dimensions[2][1]} cm
		{:else}
			<p>No dimensions</p>
		{/if}
	</div>

	<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end basis-1/6">
		<SimpleButton
			on:click={() => {
				isBuyClicked = !isBuyClicked;
			}}
			value="Buy"
		/>
	</div> -->
</div>

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

<NameModal bind:open={isNameModalOpen} bind:this={nameModal} />
