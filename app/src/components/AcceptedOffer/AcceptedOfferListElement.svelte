<script lang="ts">
	import type { ApiAcceptedShipmentOfferAccount } from '$src/utils/account/acceptedOffer';
	import { createEventDispatcher } from 'svelte';

	export let acceptedOfferMeta: ApiAcceptedShipmentOfferAccount;

	const dispatch = createEventDispatcher();

	const handleShowShipmentButtonClick = (e: MouseEvent) => {
		dispatch('shipmentShow')
	}

	$: offer = acceptedOfferMeta.account;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div on:click class="rounded-lg bg-orange-50 border border-orange-200">
	<div class="px-4 py-5 sm:px-6">
		<div class="flex items-center justify-between">
			<h3 class="sm:text-md xl:text-lg leading-6 font-medium text-gray-900">Forwarder name</h3>
			<p
				class="mt-1 text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
			>
				{offer.details.payment / 10 ** 9} SOL
			</p>
		</div>
		<div class="mt-3 xl:mt-5 flex items-center justify-between">
			<p class="text-xs xl:sm font-medium text-gray-500 mr-6 xl:mr-12">
				&#x2022
			 Accepted: {new Date(offer.accepted).toUTCString()}
				<br />
			 Message: 
			</p>


			<button class="text-sm xl:text-md text-accent font-medium" on:click={handleShowShipmentButtonClick}
				>Show details</button
			>
		</div>
	</div>
</div>
