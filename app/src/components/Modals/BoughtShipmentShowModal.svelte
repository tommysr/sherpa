<script lang="ts">
	import { get } from 'svelte/store';
	import Modal from './Modal.svelte';
	import { PublicKey } from '@solana/web3.js';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { getMakeOfferTx } from '$lib/forwarder';
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';
	import { BN } from 'bn.js';
	import { forwardedShipments, type ForwardedShipment } from '$src/stores/forwarderShipments';
	import { createNotification } from '../Notification/notificationsStore';

	export let showModal: boolean;
	export let carrierAccount: ApiCarrierAccount;
	export let selectedLocation: number | undefined;

	let time: number;
	let price: number;
	let shipment: ForwardedShipment | undefined;

	$: if (selectedLocation) {
		shipment = $forwardedShipments.at(selectedLocation);
	}

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
			walletStore.openModal();

			return;
		}

		if (!areMakeOfferParamsValid()) {
			createNotification({text: 'Invalid price', type: 'failed', removeAfter: 5000})

			return;
		}


		const tx = await getMakeOfferTx(
			program,
			new BN(price * 10 ** 9),
			timeInSecs,
			$walletStore.publicKey!,
			new PublicKey(shipment?.shipment.publicKey as string), // TODO: handle it
			new PublicKey(carrierAccount.account.authority)
		);

		try {
			const signature = await useSignAndSendTransaction(connection, wallet, tx);

			createNotification({ text: 'Tx send', type: 'success', removeAfter: 5000, signature });
		} catch (err) {
			createNotification({ text: 'Signing', type: 'failed', removeAfter: 5000 });
		}
	}

</script>

<Modal bind:showModal>
	<div class="w-full flex flex-col space-y-7">
		<div class="my-10 flex justify-center">
			<h2
				class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
			>
				{carrierAccount.account.name}
			</h2>
		</div>

		<span>
			<input
				class="w-full p-4 rounded-xl border border-primary-200 mt-4"
				type="number"
				bind:value={price}
				placeholder="enter amount you want to offer"
			/>
		</span>
		<span>
			<input
				class="w-full p-4 rounded-xl border border-primary-200 mt-4"
				type="number"
				bind:value={time}
				placeholder="time in minutes after offer will be invalid"
			/>
		</span>

		<div class="text-center pt-20">
			<button on:click={handleMakeOfferClick}>Make offer</button>
		</div>
	</div></Modal
>
