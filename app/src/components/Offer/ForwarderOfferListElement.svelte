<script lang="ts">
	import { type OfferedShipment } from '$src/stores/offers';

	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	export let offerAccount: OfferedShipment;
	export let selectedShipment: string | undefined = undefined;
	$: offer = offerAccount.meta.account;

	$: shipmentData = offerAccount.shipment.account.shipment;

	const dispatch = createEventDispatcher();

	const handleButtonClick = (e: MouseEvent) => {
		dispatch('buttonClick');
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	on:click
	class={clsx(
		'rounded-lg shadow cursor-pointer w-full',
		selectedShipment === offerAccount.shipment.publicKey ? 'bg-secondary-100' : 'bg-white'
	)}
>
	<div class="px-4 py-5 sm:px-6">
		<div class="flex items-center justify-between">
			<h3 class="sm:text-md xl:text-lg leading-6 font-medium text-gray-900">
				{offerAccount.shipment.account.name}
			</h3>
			<p
				class="mt-1 text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
			>
				{offer.details.payment / 10 ** 9} SOL
			</p>
		</div>
		<div class="mt-3 xl:mt-5 flex items-center justify-between">
			<p class="text-xs xl:sm font-medium text-gray-500 mr-6 xl:mr-12">
				&#x2022; Submitted: {new Date(offer.submitted).toUTCString()}
				<br />
				&#x2022; Expires on: {new Date(offer.timeout).toUTCString()}
				<br />
				&#x2022; Penalty: {shipmentData.penalty / 10 ** 9} SOL
				<br />
				&#x2022; Insurance:
				<span>{shipmentData.collateral / 10 ** 9} SOL</span>
			</p>

			<div class="space-y-3 flex flex-col">
				<button class="text-sm xl:text-md text-accent font-medium" on:click={handleButtonClick}
					>Show</button
				>
			</div>
		</div>
	</div>
</li>
