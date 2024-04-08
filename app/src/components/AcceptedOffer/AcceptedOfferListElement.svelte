<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { createDiffieHellman } from 'diffie-hellman';
	import { AES } from 'crypto-ts';
	import { DF_MODULUS, decodeDecrypted, decodeName } from '$src/sdk/sdk';
	import { getLocalStorage } from '$src/utils/wallet/localStorage';
	import type { AcceptedShipment } from '$src/stores/acceptedOffers';

	export let acceptedOffer: AcceptedShipment;
	export let selectedAccount: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	let viewMessage = false;

	const handleShowShipmentButtonClick = (e: MouseEvent) => {
		dispatch('shipmentShow');
	};

	function getDecryptionKey(localStorageKey: string) {
		try {
			const privateKey = getLocalStorage<string>(localStorageKey);

			if (privateKey) {
				return Buffer.from(privateKey, 'hex');
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	$: offer = acceptedOffer.meta.account;

	let message = 'decrypting...';

	$: if (viewMessage) {
		const privateKey = getDecryptionKey(`shipper${acceptedOffer.shipment.publicKey}`);

		if (privateKey) {
			const dh = createDiffieHellman(DF_MODULUS);
			dh.setPrivateKey(privateKey);
			dh.generateKeys();

			const secret = dh.computeSecret(
				Buffer.from(Uint8Array.from(acceptedOffer.shipment.account.channel.carrier))
			);

			message = decodeDecrypted(
				AES.decrypt(acceptedOffer.shipment.account.channel.data, secret.toString('hex')).words
			);
		} else {
			message = 'private key not found';
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	on:click
	class={clsx(
		'rounded-lg shadow cursor-pointer w-full',
		selectedAccount === acceptedOffer.shipment.publicKey ? 'bg-secondary-100' : 'bg-white'
	)}
>
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
				&#x2022 Accepted: {new Date(offer.accepted).toUTCString()}

				<br />
				{#if !viewMessage}
					<button class="underline" on:click|once={() => (viewMessage = true)}>view message</button>
				{:else}
					<span>Message: {message}</span>
				{/if}
			</p>

			<button
				class="text-sm xl:text-md text-accent font-medium"
				on:click={handleShowShipmentButtonClick}>Show details</button
			>
		</div>
	</div>
</li>
