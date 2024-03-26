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

	$: shipmentData = shipment?.account;
	$: timeInSecs = time * 60;
	// $: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	// $: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	// $: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	$: console.log(shipmentData?.owner);

	let status = {
		component: Empty,
		statusString: ''
	};

	const areMakeOfferParamsValid = () => {
		if (price < 0 || time < 30) {
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
			showError('name must be between 0 and 64 characters');
			return;
		}

		status.component = Pending;
		status.statusString = 'signing transaction, follow wallet instruction';

		console.log(carrierAccount);

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

		<div class="grid grid-cols-3 justify-items-center gap-y-4">
			<div
				class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
			>
				<div class="">When</div>
				<div class="">Deadline</div>
				<div class="">Priority</div>
			</div>

			<!-- <div>
				<span>{new Date(shipmentData.shipment.accoun.when).toLocaleDateString()}</span>
			</div>
			<div>
				<span>{new Date(shipmentData.shipment.deadline).toLocaleDateString()}</span>
			</div> -->
			<div>
				<span>High</span>
			</div>
		</div>

		<div class="grid grid-cols-3 justify-items-center gap-y-4">
			<div
				class="col-span-3 grid items-center opacity-80 justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
			>
				<div class="col-span-3">Locations</div>
			</div>

			<div class="col-span-3">
				<!-- {#if locations}
					{@const len = locations.length}

					{#each locations as [location, value], index}
						 TODO: batching or keep locations on server 
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
				{/if} -->
			</div>
		</div>

		<div class="grid grid-cols-3 justify-items-center gap-y-4">
			<div
				class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
			>
				<div>Weight</div>
				<div class="col-span-2">Depth x Height x Width</div>
			</div>

			<div>
				<!-- {#if dimensions}
					{dimensions[3][1]} kg
				{:else}
					<p>No dimensions</p>
				{/if} -->
			</div>
			<div class="col-span-2">
				<!-- {#if dimensions}
					{dimensions[0][1]} x {dimensions[1][1]} x {dimensions[2][1]} cm
				{:else}
					<p>No dimensions</p>
				{/if} -->
			</div>
		</div>
	</div>

	<svelte:component this={status.component} status={status.statusString} />

	<div class="text-center pt-20">
		<button on:click={handleMakeOfferClick}>Make offer</button>
	</div>
</Modal>
