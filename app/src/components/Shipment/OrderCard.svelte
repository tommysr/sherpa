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
	import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
	import { getBoughtShipmentAddress, getForwarderAddress, getShipperAddress } from '$sdk/sdk';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { encodeName } from '$sdk/sdk';
	import SimpleButton from '../Buttons/SimpleButton.svelte';
	import type { Entries } from '$src/utils/types/object';
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
			isNameModalOpen = true;
			const name = await waitForName();
			const registerIx = await registerForwarderIx(forwarder, name);
			tx.add(registerIx);
		}

		const ix = await program.methods
			.buyShipment()
			.accounts({
				shipper: getShipperAddress(program, new PublicKey(shipmentAccount.account.shipper)),
				shipment: new PublicKey(shipmentAccount.publicKey),
				forwarder,
				bought: getBoughtShipmentAddress(program, wallet.publicKey!, forwarderAccount?.count || 0),
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

<div class="rounded bg-[theme(colors.mint)] my-3 first:mt-0 last:mb-0 p-6">
	<div class="flex justify-between items-center gap-x-3">
		<div class="basis-5/6 flex flex-row justify-between">
			<div class="basis-1/3 text-2xl font-semibold text-center hover:text-orange-700">
				<h3>{shipmentData.price / 10 ** 9} SOL</h3>
			</div>
			<div class="basis-1/3">
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
			<div class="basis-1/3">
				{#if dimensions}
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
				{:else}
					<p>No dimensions</p>
				{/if}
			</div>
		</div>
		<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end basis-1/6">
			<SimpleButton
				on:click={() => {
					isBuyClicked = !isBuyClicked;
				}}
				value="Buy"
			/>
		</div>
	</div>
	<footer class="flex justify-between">
		<span>Date: {new Date(shipmentData.shipment.when).toDateString()}</span>
		<span>Deadline: {new Date(shipmentData.shipment.deadline).toDateString()}</span>
	</footer>
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
