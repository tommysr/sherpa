<script lang="ts">
	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import {
		getShipmentAddress,
		getShipperAddress,
		getStateAddressWithBump
	} from '$src/lib/addresses';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { formStore } from '$stores/orderForm';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { Transaction, type PublicKey } from '@solana/web3.js';
	import { BN } from 'bn.js';
	import { get } from 'svelte/store';
	import PricePick from '$src/components/ShipmentForm/PricePick.svelte';
	import DatePick from '$src/components/ShipmentForm/DatePick.svelte';
	import DimensionsPick from '$src/components/ShipmentForm/DimensionsPick.svelte';
	import Details from '$src/components/ShipmentForm/Details.svelte';

	async function registerShipper(shipper: PublicKey) {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		const registerShipperIx = await program.methods
			.registerShipper()
			.accounts({
				shipper,
				signer: wallet.publicKey!
			})
			.instruction();
		const tx = new Transaction().add(registerShipperIx);

		await useSignAndSendTransaction(connection, wallet, tx);
	}

	function validateOrderForm() {
		// console.log(price, when, deadline);
		// if (price <= 0) {
		// 	throw new Error('Price must be greater than 0');
		// }
		// if (when < new Date()) {
		// 	throw new Error('When must be in the future');
		// }
		// if (deadline < when) {
		// 	throw new Error('Deadline must be after when');
		// }
	}

	async function addOrder() {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);
		const [stateAddress, _] = getStateAddressWithBump(program);

		// DEV
		let stateExists = (await program.account.state.fetchNullable(stateAddress)) !== null;

		if (!stateExists) {
			throw new Error('State not initialized');
		}
		// END DEV

		const shipper = getShipperAddress(program, wallet.publicKey!);
		const shipperAccount = await program.account.shipper.fetchNullable(shipper);

		if (!shipperAccount) {
			await registerShipper(shipper);
		}

		const shipment = getShipmentAddress(program, wallet.publicKey!, shipperAccount?.count || 0);

		const createShipmentIx = await program.methods
			.createShipment(new BN(0 * 10 ** 6), {
				deadline: new BN(0),
				// 0 for now, will be updated later
				details: {
					priority: 0,
					access: 0,
					count: 0,
					fragility: 0,
					reserved: [0, 0, 0, 0]
				},
				// same as above, would be nice to implement logic used in protocol
				// to avoid getting all the values from the user
				dimensions: { depth: 0, height: 0, weight: 0, width: 0 },
				// TODO: array is awful, should be an object
				geography: {
					from: { latitude: 0, longitude: 0 },
					to: { latitude: 0, longitude: 0 }
				},
				when: new BN(0)
			})
			.accounts({
				shipper,
				shipment,
				signer: wallet.publicKey!
			})
			.instruction();

		const tx = new Transaction().add(createShipmentIx);
		const sig = await useSignAndSendTransaction(connection, wallet, tx);
		console.log(sig);
	}

	async function handleOrderAdd(event: { currentTarget: EventTarget & HTMLFormElement }) {
		validateOrderForm();
		await addOrder();
	}

	function handleButtonClick(event: Event) {
		if ($formStore.nextState === 'dimensions') {
			$formStore.nextState = 'properties';
		} else if ($formStore.nextState === 'properties') {
			$formStore.nextState = 'submit';
		}

		if ($formStore.nextState === 'submit') {
			// open modal?
			validateOrderForm();
		}
	}

	function handleBackButtonClick(event: Event) {
		if ($formStore.nextState === 'properties') {
			$formStore.nextState = 'dimensions';
		} else if ($formStore.nextState === 'submit') {
			$formStore.nextState = 'properties';
		}
	}
</script>

<!-- CONSIDER: avoid binding to much -->
<main class="container">
	<div class="form-box">
		<button class="s-button" on:click={handleBackButtonClick}>back</button>
		<form method="post" on:submit|preventDefault={handleOrderAdd}>
			{#if $formStore.nextState == 'dimensions'}
				<PricePick bind:price={$formStore.price} />
				<DatePick name="when" bind:date={$formStore.when} />
				<DatePick name="deadline" bind:date={$formStore.deadline} />
				<LocationPick
					bind:shipmentSourceCoords={$formStore.location.from}
					bind:shipmentDestinationCoords={$formStore.location.to}
				/>
			{:else if $formStore.nextState == 'properties'}
				<DimensionsPick
					bind:weightMetrics={$formStore.weightMetrics}
					bind:distanceMetrics={$formStore.distanceMetrics}
					bind:weight={$formStore.dimensions.weight}
					bind:width={$formStore.dimensions.width}
					bind:height={$formStore.dimensions.height}
				/>
			{:else if $formStore.nextState == 'submit'}
				<Details />
			{/if}

			<button class="s-button" type="submit" on:click|preventDefault={handleButtonClick}
				>{$formStore.nextState}</button
			>
		</form>
	</div>
</main>

<style lang="scss">
	.form-box {
		margin-top: 20px;
	}

	.s-button {
		margin-top: 20px;
	}
</style>
