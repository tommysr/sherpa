<script lang="ts">
	import type { ApiShipmentAccount, Geography, ShipmentDimensions } from '$src/utils/idl/shipment';
	import type { Entries } from '$src/utils/types/object';
	import { get } from 'svelte/store';
	import Modal from './Modal.svelte';
	import { PublicKey } from '@solana/web3.js';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { getBuyShipmentTx } from '$lib/forwarder';
	import { userStore } from '$src/stores/user';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import Pending from '../Statuses/Pending.svelte';
	import Empty from '../Statuses/Empty.svelte';
	import Error from '../Statuses/Error.svelte';
	import TransactionSent from '../Statuses/TransactionSent.svelte';

	export let showModal: boolean;
	export let shipmentAccount: ApiShipmentAccount;

	$: shipmentData = shipmentAccount.account;
	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	// $: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	let status = {
		component: Empty,
		statusString: ''
	};

	function isAccountNameValid(name: string): boolean {
		if (name.length == 0 || name.length > 64) {
			return false;
		}
		return true;
	}

	function showError(error: string) {
		status.component = Error;
		status.statusString = error;
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
			showError('name must be between 0 and 64 characters');
			return;
		}

		status.component = Pending;
		status.statusString = 'signing transaction, follow wallet instruction';

		const tx = await getBuyShipmentTx(
			program,
			$walletStore.publicKey,
			new PublicKey(shipmentAccount.publicKey),
			new PublicKey(shipmentAccount.account.shipper),
			name
		);

		try {
			const sig = await useSignAndSendTransaction(connection, wallet, tx);

			const indexToRemove = $searchableShipments.data.findIndex(
				(s) => s.publicKey === shipmentAccount.publicKey
			);
			searchableShipments.shrink(indexToRemove);

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
				{shipmentData.price / 10 ** 9} SOL
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

			<div>
				<span>{new Date(shipmentData.shipment.when).toLocaleDateString()}</span>
			</div>
			<div>
				<span>{new Date(shipmentData.shipment.deadline).toLocaleDateString()}</span>
			</div>
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
		</div>

		<div class="grid grid-cols-3 justify-items-center gap-y-4">
			<div
				class="col-span-3 grid grid-cols-3 opacity-80 items-center justify-items-center w-full text-white py-2 rounded-lg bg-gradient-to-r from-primary to-secondary"
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
		</div>
	</div>

	{#if !$userStore.forwarder.registered}
		<p>
			You are not registered as a forwarder. Please enter your name to be registered as a forwarder.
			This will allow you to buy shipment.
		</p>

		<input
			class="w-full p-4 rounded-xl border border-primary-200 mt-4"
			type="text"
			bind:value={$userStore.forwarder.name}
			placeholder="enter forwarder name to be registered"
		/>
	{/if}

	<svelte:component this={status.component} status={status.statusString} />

	<div class="text-center pt-20">
		<button on:click={handleBuyClick}>Buy</button>
	</div>
</Modal>
