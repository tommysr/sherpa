<script lang="ts">
	import { anchorStore } from '$src/stores/anchor';
	import type {
		ShipmentDimensions,
		Geography,
		ShipmentDetails,
		ApiShipmentAccount
	} from '$src/utils/idl/shipment';
	import { get } from 'svelte/store';
	import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
	import { getBoughtShipmentAddress, getForwarderAddress, getShipperAddress } from '$sdk/sdk';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { encodeName } from '$sdk/sdk';
	import SimpleButton from '../Buttons/SimpleButton.svelte';
	import type { Entries } from '$src/utils/types/object';

	import ShipmentDataView from './ShipmentDataView.svelte';
	import TransactionSendModal from '../Modals/TransactionSendModal.svelte';
	import { searchableShipments } from '$src/stores/searchableShipments';

	export let shipmentAccount: ApiShipmentAccount;

	$: shipmentData = shipmentAccount.account;
	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	$: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	let isOpenedBuyModal: boolean = false;
	let isRegisteredAsForwarder = true;
	let forwarderName: string = '';
	let forwarderCount: number = 0;
	let forwarderPubkey: PublicKey;

	async function validateAccountName(name: string) {
		if (name.length < 0 || name.length > 64) {
			throw 'Name must be between 1 and 64 characters';
		}
	}

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

	async function handleBuyClick() {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);

		if (wallet.publicKey) {
			const forwarder = getForwarderAddress(program, wallet.publicKey);
			const forwarderAccount = await program.account.forwarder.fetchNullable(forwarder);

			if (!forwarderAccount) {
				isRegisteredAsForwarder = false;
			}

			forwarderPubkey = forwarder;
			forwarderCount = forwarderAccount?.count || 0;
			isOpenedBuyModal = true;
		} else {
			alert('Please connect your wallet');
		}
	}

	async function handleBuyOrder(): Promise<{ signature: string }> {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);

		const tx = new Transaction();

		if (!isRegisteredAsForwarder) {
			validateAccountName(forwarderName);
			const registerIx = await registerForwarderIx(forwarderPubkey, forwarderName);
			tx.add(registerIx);
		}

		const ix = await program.methods
			.buyShipment()
			.accounts({
				shipper: getShipperAddress(program, new PublicKey(shipmentAccount.account.shipper)),
				shipment: new PublicKey(shipmentAccount.publicKey),
				forwarder: forwarderPubkey,
				bought: getBoughtShipmentAddress(program, wallet.publicKey!, forwarderCount),
				signer: wallet.publicKey!
			})
			.instruction();

		tx.add(ix);

		try {
			const sig = await useSignAndSendTransaction(connection, wallet, tx);

			const indexToRemove = $searchableShipments.data.findIndex(
				(s) => s.publicKey === shipmentAccount.publicKey
			);

			searchableShipments.shrink(indexToRemove);
			return { signature: sig };
		} catch (err) {
			throw 'signing failed';
		}
	}
</script>

<div class="rounded bg-[theme(colors.mint)] my-3 first:mt-0 last:mb-0 p-3">
	<div>
		<div>
			<h3 class="text-center text-3xl">{shipmentData.price / 10 ** 9} SOL</h3>

			<ShipmentDataView shipmentData={shipmentData.shipment} />
		</div>
		<div class="flex justify-center">
			<SimpleButton on:click={handleBuyClick} value="Buy" />
		</div>
	</div>
</div>

<TransactionSendModal bind:open={isOpenedBuyModal} sendTransactionHandler={handleBuyOrder}>
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

		{#if !isRegisteredAsForwarder}
			<p>
				You are not registered as a forwarder. Please enter your name to be registered as a
				forwarder. This will allow you to buy shipment.
			</p>

			<input
				class="w-full p-4 rounded-xl border border-[theme(colors.mint)] mt-4"
				type="text"
				bind:value={forwarderName}
				placeholder="enter forwarder name to be registered"
			/>
		{/if}
	</svelte:fragment>
</TransactionSendModal>
