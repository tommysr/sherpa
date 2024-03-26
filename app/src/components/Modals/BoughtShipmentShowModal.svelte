<script lang="ts">
	import { get } from 'svelte/store';
	import Modal from './Modal.svelte';
	import { PublicKey } from '@solana/web3.js';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { getMakeOfferTx } from '$lib/forwarder';
	import Pending from '../Statuses/Pending.svelte';
	import Empty from '../Statuses/Empty.svelte';
	import Error from '../Statuses/Error.svelte';
	import TransactionSent from '../Statuses/TransactionSent.svelte';
	import type { ApiCarrierAccount } from '$src/utils/idl/carrier';
	import {
		searchableBoughtShipments,
		type SearchableBoughtOrder
	} from '$src/stores/forwarderShipments';
	import { BN } from 'bn.js';

	export let showModal: boolean;
	export let carrierAccount: ApiCarrierAccount;
	export let selectedLocation: number | undefined;

	let time: number;
	let price: number;

	let shipment: SearchableBoughtOrder | undefined;

	$: if (selectedLocation) {
		shipment = $searchableBoughtShipments.filtered.at(selectedLocation);
	}

	$: timeInSecs = time * 60;

	let status = {
		component: Empty,
		statusString: ''
	};

	const areMakeOfferParamsValid = () => {
		if (!price || !time || price < 0 || time < 30) {
			return false;
		}

		return true;
	};

	function showError(error: string) {
		status.component = Error;
		status.statusString = error;
	}

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
			showError('price must be higher than zero and time greater than 30 minutes');
			return;
		}

		status.component = Pending;
		status.statusString = 'signing transaction, follow wallet instruction';

		const tx = await getMakeOfferTx(
			program,
			new BN(price * 10 ** 9),
			timeInSecs,
			$walletStore.publicKey!,
			new PublicKey(shipment?.publicKey as string), // TODO: handle it
			new PublicKey(carrierAccount.account.authority)
		);

		try {
			const sig = await useSignAndSendTransaction(connection, wallet, tx);

			status.component = TransactionSent;
			status.statusString = sig;
			console.log(sig);
		} catch (err) {
			showError('signing failed');
		}
	}

	async function getLocationFromCoords(lat: number, long: number): Promise<string> {
		return `Kraków, Poland`;
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

		<svelte:component this={status.component} status={status.statusString} />

		<div class="text-center pt-20">
			<button on:click={handleMakeOfferClick}>Make offer</button>
		</div>
	</div></Modal
>
