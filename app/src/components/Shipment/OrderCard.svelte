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
	import type { ComponentEvents } from 'svelte';
	import ShipmentDataView from './ShipmentDataView.svelte';

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
			nameModal.$on('name', (e: ComponentEvents<NameModal>['name']) => {
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
</script>

<div class="rounded bg-[theme(colors.mint)] my-3 first:mt-0 last:mb-0 p-3">
	<div>
		<div>
			<h3 class="text-center text-3xl">{shipmentData.price / 10 ** 9} SOL</h3>

			<ShipmentDataView shipmentData={shipmentData.shipment} />
		</div>
		<div class="flex justify-center">
			<SimpleButton
				on:click={() => {
					isBuyClicked = !isBuyClicked;
				}}
				value="Buy"
			/>
		</div>
	</div>
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
