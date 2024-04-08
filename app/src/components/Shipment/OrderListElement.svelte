<script lang="ts">
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { getLocalStorage } from '$src/utils/wallet/localStorage';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { createDiffieHellman } from 'diffie-hellman';
	import { AES } from 'crypto-ts';
	import { walletStore } from '$src/stores/wallet';
	import { DF_MODULUS, decodeDecrypted, decodeName } from '$src/sdk/sdk';

	export let shipmentAccount: ApiShipmentAccount;
	export let selectedAccount: string | undefined = undefined;
	export let showStatus = false;
	export let acceptCallback: () => void = () => {};

	let viewMessage = false;
	const dispatch = createEventDispatcher();
	const handleShowClick = (e: MouseEvent) => {
		dispatch('buttonClicked');
	};

	$: shipmentData = shipmentAccount.account;
	$: locations = shipmentData.shipment.geography;
	$: priority = getPriority(shipmentData.shipment.details.priority);
	$: statusNumber = shipmentData.status;
	$: status = getStatusString(statusNumber);
	$: isViewerShipper =
		$walletStore.publicKey && $walletStore.publicKey.toString() === shipmentData.shipper;

	$: messageNeeded = isViewerShipper && shipmentData.status >= 4;

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

	let message = 'decrypting...';

	$: if (messageNeeded && viewMessage) {
		const privateKey = getDecryptionKey(`shipper${shipmentAccount.publicKey}`);

		if (privateKey) {
			const dh = createDiffieHellman(DF_MODULUS);
			dh.setPrivateKey(privateKey);
			dh.generateKeys();

			const secret = dh.computeSecret(
				Buffer.from(Uint8Array.from(shipmentAccount.account.channel.carrier))
			);

			message = decodeDecrypted(
				AES.decrypt(shipmentAccount.account.channel.data, secret.toString('hex')).words
			);
		} else {
			message = 'private key not found';
		}
	}

	function getStatusString(status: number) {
		switch (status) {
			case 5:
				return 'Delivered';
			case 4:
				return 'Accepted by carrier';
			case 3:
				return 'Offered to carrier';
			case 2:
				return 'Bought by forwarder';
			case 1:
				return 'Not yet bought';
			default:
				return 'Unknown';
		}
	}

	const getPriority = (priority: number) => {
		switch (priority) {
			case 5:
				return {
					name: 'Very high',
					color: 'text-red-800'
				};
			case 4:
				return {
					name: 'High',
					color: 'text-red-500'
				};
			case 3:
				return {
					name: 'Medium',
					color: 'text-orange-400'
				};
			case 2:
				return {
					name: 'Low',
					color: 'text-green-300'
				};
			case 1:
				return {
					name: 'Very low',
					color: 'text-green-500'
				};
			default:
				return {
					name: 'Unknown',
					color: 'text-gray-600'
				};
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	on:click
	class={clsx(
		'rounded-lg shadow cursor-pointer w-full',
		selectedAccount === shipmentAccount.publicKey ? 'bg-secondary-100' : 'bg-white'
	)}
>
	<div class="px-4 py-5 sm:px-6">
		<div class="flex items-center justify-between">
			<h3 class="text-base xl:text-lg leading-6 font-medium text-gray-900">
				{shipmentData.name}
			</h3>
			<p
				class="mt-1 text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
			>
				{shipmentData.price / 10 ** 9} SOL
			</p>
		</div>
		<div class="mt-3 xl:mt-5 flex items-center justify-between">
			<p class="text-xs font-medium text-gray-500 mr-6 xl:mr-12">
				&#x2022; Starting location: <span class="font-semibold">{locations.fromName}</span>
				<br />
				&#x2022; Destination: <span class="font-semibold">{locations.toName}</span>
				<br />
				<br />
				&#x2022; Priority:
				<span class={clsx('font-semibold', priority.color)}>{priority.name}</span>
				<br />
				&#x2022; Penalty:
				<span>{shipmentAccount.account.shipment.penalty / 10 ** 9} SOL</span>
				<br />
				&#x2022; Insurance:
				<span>{shipmentAccount.account.shipment.collateral / 10 ** 9} SOL</span>

				{#if showStatus}
					<br />
					&#x2022; Status:
					<span class={clsx('font-semibold')}>{status}</span>
				{/if}
				<br />
				{#if messageNeeded}
					<br />
					{#if !viewMessage}
						<button class="underline" on:click|once={() => (viewMessage = true)}
							>view message</button
						>
					{:else}
						<span>Message: {message}</span>
					{/if}
				{/if}
			</p>

			<button class="text-sm xl:text-md text-accent font-medium mx-4" on:click={handleShowClick}
				>Show</button
			>

			{#if shipmentAccount.account.status == 4}
				<button class="text-sm xl:text-md text-accent font-medium" on:click={acceptCallback}
					>Confirm</button
				>
			{/if}
		</div>
	</div>
</li>
