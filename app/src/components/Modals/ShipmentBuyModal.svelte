<script lang="ts">
	import { getBuyShipmentTx } from '$lib/forwarder';
	import { anchorStore } from '$src/stores/anchor';
	import { awaitedConfirmation } from '$src/stores/confirmationAwait';
	import { userStore } from '$src/stores/user';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { getShipmentSummary } from '$src/utils/utils';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { PublicKey } from '@solana/web3.js';
	import { get } from 'svelte/store';
	import Button from '../Buttons/Button.svelte';
	import { createNotification, removeNotification } from '../Notification/notificationsStore';
	import SummaryWrapper from '../SummaryWrapper.svelte';
	import Modal from './Modal.svelte';

	export let showModal: boolean;
	export let shipmentAccount: ApiShipmentAccount;

	$: shipmentData = shipmentAccount.account;

	function isAccountNameValid(name: string | null): boolean {
		if (!name || name.length == 0 || name.length > 64) {
			return false;
		}
		return true;
	}

	async function handleBuyClick() {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);
		const {
			forwarder: { name }
		} = get(userStore);

		if (!$walletStore.publicKey) {
			showModal = false;
			walletStore.openModal();
			return;
		}

		if (!isAccountNameValid(name)) {
			createNotification({ text: 'invalid name', type: 'failed', removeAfter: 5000 });
			return;
		}

		const id = createNotification({ text: 'Signing', type: 'loading', removeAfter: undefined });

		const tx = await getBuyShipmentTx(
			program,
			$walletStore.publicKey,
			new PublicKey(shipmentAccount.publicKey),
			new PublicKey(shipmentAccount.account.shipper),
			name!
		);

		try {
			const signature = await useSignAndSendTransaction(connection, wallet, tx);

			removeNotification(id);
			createNotification({ text: 'Transaction', type: 'success', removeAfter: 5000, signature });

			const confirmation = createNotification({
				text: 'Confirmation',
				type: 'loading',
				removeAfter: 15000
			});

			awaitedConfirmation.set(confirmation);
			showModal = false;
		} catch (err) {
			removeNotification(id);
			createNotification({ text: 'Signing', type: 'failed', removeAfter: 5000 });
		}
	}

	$: summaryData = getShipmentSummary(shipmentData);
</script>

<Modal bind:showModal on:backdropClick={() => (showModal = false)}>
	<h2
		class="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center my-7"
	>
		Buy Shipment
	</h2>
	<SummaryWrapper shipment={summaryData} />

	{#if !$userStore.forwarder.registered}
		<hr class="my-6" />
		<div class="px-4 text-neutral-600">
			<p class="px-3 text-center text-sm">
				You are not registered as a forwarder. Please enter your name to be registered as a
				forwarder.
			</p>

			<input
				class="mt-4 w-full bg-transparent px-3 py-2 text-sm placeholder-primary placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base rounded-lg border-2 border-gradient-to-r from-primary to-secondary"
				type="text"
				bind:value={$userStore.forwarder.name}
				placeholder="Enter forwarder name to be registered"
			/>
		</div>
	{/if}

	<div class="text-center pt-8">
		<Button class="text-lg uppercase tracking-widest" on:click={handleBuyClick}>Buy</Button>
	</div>
</Modal>
