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
	import SimpleButton from '$src/components/Buttons/SimpleButton.svelte';
	import { encodeName } from '../../../../../sdk/sdk';

	async function registerShipper(shipper: PublicKey) {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		const registerShipperIx = await program.methods
			.registerShipper(encodeName('shipper'))
			.accounts({
				shipper,
				signer: wallet.publicKey!
			})
			.instruction();
		const tx = new Transaction().add(registerShipperIx);

		await useSignAndSendTransaction(connection, wallet, tx);
	}

	// something simple for now, most assertions should be moved
	// to the component, but for now it's fine
	function validateOrderForm() {
		const orderStore = get(formStore);

		if (orderStore.price! <= 0) {
			throw new Error('Price must be greater than 0');
		}
		if (orderStore.when! < new Date()) {
			throw new Error('When must be in the future');
		}
		if (orderStore.deadline! < orderStore.when!) {
			throw new Error('Deadline must be after when');
		}

		if (orderStore.isMetricTon) {
			orderStore.dimensions.depth = 0;
			orderStore.dimensions.height = 0;
			orderStore.dimensions.weight = 0;
		}
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
		const order = get(formStore);

		const { price, when, deadline } = order;
		const { access, count, fragility, priority } = order.details;
		const { depth, height, weight, width } = order.dimensions;
		const { from, to } = order.location;

		// typing XD
		const deadlineDate = new Date(deadline!);
		const whenDate = new Date(when!);

		const createShipmentIx = await program.methods
			.createShipment(new BN(price! * 10 ** 9), {
				deadline: new BN(deadlineDate.valueOf()),
				details: {
					priority: priority ?? 0,
					access: access ?? 0,
					count: count ?? 1,
					fragility: fragility ?? 0,
					reserved: [0, 0, 0, 0]
				},
				dimensions: {
					depth: depth ?? 0,
					height: height ?? 0,
					weight: weight ?? 0,
					width: width ?? 0
				},
				geography: {
					from: { latitude: from?.lat!, longitude: from?.lng! },
					to: { latitude: to?.lat!, longitude: from?.lng! }
				},
				when: new BN(whenDate.valueOf())
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

	// Not sure if i can use $ in typescript, but seems it works
	async function handleButtonClick(event: Event) {
		if ($formStore.nextState === 'dimensions') {
			$formStore.nextState = 'properties';
		} else if ($formStore.nextState === 'properties') {
			$formStore.nextState = 'submit';
		}

		if ($formStore.nextState === 'submit') {
			// open modal?
			validateOrderForm();
			await addOrder();
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
		{#if $formStore.nextState != 'dimensions'}
			<button class="s-button" on:click={handleBackButtonClick}>back</button>
		{/if}

		<form method="post" on:submit|preventDefault={handleButtonClick}>
			{#if $formStore.nextState == 'dimensions'}
				<PricePick bind:price={$formStore.price} />
				<table>
					<DatePick name="when" bind:date={$formStore.when} />
					<DatePick name="deadline" bind:date={$formStore.deadline} />
				</table>
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
					bind:depth={$formStore.dimensions.depth}
					bind:isMetricTon={$formStore.isMetricTon}
				/>
			{:else if $formStore.nextState == 'submit'}
				<Details
					bind:priority={$formStore.details.priority}
					bind:count={$formStore.details.count}
					bind:fragility={$formStore.details.fragility}
					bind:access={$formStore.details.access}
				/>
			{/if}

			<SimpleButton value={$formStore.nextState} on:click={handleButtonClick} />
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
