<script lang="ts">
	import { getMakeOfferTx } from '$lib/forwarder';
	import { anchorStore } from '$src/stores/anchor';
	import { awaitedConfirmation } from '$src/stores/confirmationAwait';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { PublicKey } from '@solana/web3.js';
	import { BN } from 'bn.js';
	import { get } from 'svelte/store';
	import Button from '../Buttons/Button.svelte';
	import DecimalInput from '../Inputs/DecimalInput.svelte';
	import { createNotification, removeNotification } from '../Notification/notificationsStore';
	import Modal from './Modal.svelte';

	export let showModal: boolean;
	export let carrierAccount: ApiCarrierAccount;
	export let shipmentAccount: ApiShipmentAccount;

	let time: number;
	let price: number;

	$: timeInSecs = time * 60;

	const areMakeOfferParamsValid = () => {
		if (!price || !time || price < 0 || time < 30) {
			return false;
		}

		return true;
	};

	async function handleMakeOfferClick() {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);

		if (!$walletStore.publicKey) {
			showModal = false;

			createNotification({ text: 'wallet not connected', type: 'failed', removeAfter: 5000 });

			walletStore.openModal();

			return;
		}

		if (!areMakeOfferParamsValid()) {
			createNotification({ text: 'Invalid price', type: 'failed', removeAfter: 5000 });

			return;
		}

		const id = createNotification({ text: 'signing', type: 'loading', removeAfter: undefined });

		const tx = await getMakeOfferTx(
			program,
			new BN(price * 10 ** 9),
			timeInSecs,
			$walletStore.publicKey!,
			new PublicKey(shipmentAccount.publicKey),
			new PublicKey(carrierAccount.account.authority)
		);

		try {
			const signature = await useSignAndSendTransaction(connection, wallet, tx);

			createNotification({ text: 'Tx send', type: 'success', removeAfter: 5000, signature });
			removeNotification(id);

			const confirmation = createNotification({
				text: 'waiting for confirmation',
				type: 'loading',
				removeAfter: 30000
			});
			awaitedConfirmation.set(confirmation);

			showModal = false;
		} catch (err) {
			createNotification({ text: 'Signing', type: 'failed', removeAfter: 5000 });
			removeNotification(id);
		}
	}
</script>

<Modal bind:showModal on:backdropClick={() => (showModal = false)}>
	<div class="text-neutral-600">
		<h2
			class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
		>
			{carrierAccount.account.name}
		</h2>
		<p class="text-neutral-600 text-sm max-w-sm mt-2">Make offer for carrier.</p>

		<div class="px-6 space-y-4 mt-8">
			<DecimalInput
				name="price"
				type="number"
				bind:value={price}
				placeholder="Enter amount you want to offer"
			/>

			<DecimalInput
				name="time"
				type="number"
				bind:value={time}
				placeholder="Time in minutes after offer will be invalid"
			/>
		</div>

		<div class="flex justify-center space-x-5 mt-8">
			<Button class="uppercase tracking-widest" on:click={handleMakeOfferClick}>Make offer</Button>
		</div>
	</div>
</Modal>
