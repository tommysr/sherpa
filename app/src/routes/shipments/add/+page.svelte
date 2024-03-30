<script lang="ts">
	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import { getShipmentAddress, getShipperAddress, getStateAddress } from '$sdk/sdk';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { formStore } from '$stores/orderForm';
	import { FormStates } from '$stores/orderForm';
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
	import { encodeName } from '$sdk/sdk';

	// async function registerShipper(shipper: PublicKey) {
	// 	const { program } = get(anchorStore);
	// 	const { connection } = get(web3Store);
	// 	const wallet = get(walletStore);

	// 	const registerShipperIx = await program.methods
	// 		.registerShipper(encodeName('shipper'))
	// 		.accounts({
	// 			shipper,
	// 			signer: wallet.publicKey!
	// 		})
	// 		.instruction();
	// 	const tx = new Transaction().add(registerShipperIx);

	// 	await useSignAndSendTransaction(connection, wallet, tx);
	// }

	// // something simple for now, most assertions should be moved
	// // to the component, but for now it's fine
	// function validateOrderForm() {
	// 	const orderStore = get(formStore);

	// 	if (orderStore.price! <= 0) {
	// 		throw new Error('Price must be greater than 0');
	// 	}
	// 	if (orderStore.dates.when < new Date()) {
	// 		throw new Error('When must be in the future');
	// 	}
	// 	if (orderStore.dates.deadline < orderStore.dates.when) {
	// 		throw new Error('Deadline must be after when');
	// 	}

	// 	if (orderStore.isMetricTon) {
	// 		$formStore.dimensions.depth = 0;
	// 		$formStore.dimensions.height = 0;
	// 		$formStore.dimensions.width = 0;
	// 	}
	// }

	// async function addOrder() {
	// 	const { program } = get(anchorStore);
	// 	const { connection } = get(web3Store);
	// 	const wallet = get(walletStore);
	// 	const stateAddress = getStateAddress(program);

	// 	// DEV
	// 	let stateExists = (await program.account.state.fetchNullable(stateAddress)) !== null;

	// 	if (!stateExists) {
	// 		throw new Error('State not initialized');
	// 	}
	// 	// END DEV

	// 	const shipper = getShipperAddress(program, wallet.publicKey!);
	// 	const shipperAccount = await program.account.shipper.fetchNullable(shipper);

	// 	if (!shipperAccount) {
	// 		await registerShipper(shipper);
	// 	}

	// 	const shipment = getShipmentAddress(program, wallet.publicKey!, shipperAccount?.count || 0);
	// 	const order = get(formStore);

	// 	const { price, dates } = order;
	// 	const { deadline, when } = dates;
	// 	const { from, to } = order.location;

	// 	console.log(order);

	// 	// typing XD
	// 	const deadlineDate = new Date(deadline!);
	// 	const whenDate = new Date(when!);

	// 	const createShipmentIx = await program.methods
	// 		.createShipment(new BN(price! * 10 ** 9), encodeName('TODO'), {
	// 			deadline: new BN(deadlineDate.valueOf()),
	// 			details: order.details,
	// 			dimensions: order.dimensions,
	// 			geography: {
	// 				from: { latitude: from?.lat!, longitude: from?.lng! },
	// 				fromName: encodeName('cracow TODO'),
	// 				to: { latitude: to?.lat!, longitude: from?.lng! },

	// 				toName: encodeName('warsaw TODO')
	// 			},
	// 			when: new BN(whenDate.valueOf())
	// 		})
	// 		.accounts({
	// 			shipper,
	// 			shipment,
	// 			signer: wallet.publicKey!
	// 		})
	// 		.instruction();

	// 	const tx = new Transaction().add(createShipmentIx);
	// 	const sig = await useSignAndSendTransaction(connection, wallet, tx);
	// 	console.log(sig);
	// }

	// // Not sure if i can use $ in typescript, but seems it works
	// async function handleButtonClick(event: Event) {
	// 	const { currentState } = get(formStore);

	// 	if (currentState == FormStates.Properties) {
	// 		// open modal?
	// 		validateOrderForm();
	// 		await addOrder();

	// 		formStore.resetForm();
	// 	}

	// 	formStore.progressForm();
	// }

	// function handleBackButtonClick(event: Event) {
	// 	formStore.regressForm();
	// }
</script>

<!-- CONSIDER: avoid binding to much -->
<main class="container">
	<div class="form-box">
		{#if $formStore.currentState != FormStates.Main}
			<button class="s-button" on:click={handleBackButtonClick}>back</button>
		{/if}

		<form method="post" on:submit|preventDefault={handleButtonClick}>
			{#if $formStore.currentState == FormStates.Main}
				<PricePick bind:price={$formStore.price} />
				<table>
					<DatePick name="when" bind:date={$formStore.dates.when} />
					<DatePick name="deadline" bind:date={$formStore.dates.deadline} />
				</table>
				<LocationPick
					bind:shipmentSourceCoords={$formStore.location.from}
					bind:shipmentDestinationCoords={$formStore.location.to}
				/>
			{:else if $formStore.currentState == FormStates.Dimensions}
				<DimensionsPick
					bind:metrics={$formStore.metrics}
					bind:dimensions={$formStore.dimensions}
					bind:isMetricTon={$formStore.isMetricTon}
				/>
			{:else if $formStore.currentState == FormStates.Properties}
				<Details bind:details={$formStore.details} />
			{/if}

			<SimpleButton
				value={$formStore.currentState === FormStates.Properties ? 'submit' : 'next'}
				on:click={handleButtonClick}
			/>
		</form>
	</div>
</main>
