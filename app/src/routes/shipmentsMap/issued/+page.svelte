<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import {
		createNotification,
		removeNotification
	} from '$src/components/Notification/notificationsStore';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { confirmShipmentTx } from '$src/lib/shipper';
	import { acceptedShipmentOffers } from '$src/stores/acceptedOffers';
	import { anchorStore } from '$src/stores/anchor';
	import { awaitedConfirmation } from '$src/stores/confirmationAwait';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import { web3Store } from '$src/stores/web3';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { walletStore } from '$stores/wallet';
	import { program } from '@coral-xyz/anchor/dist/cjs/native/system';
	import { PublicKey } from '@solana/web3.js';
	import clsx from 'clsx';
	import { get } from 'svelte/store';

	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let showShipmentDetailsModal = false;
	let isMobileOpen = false;
	let selectedNav: number = 0;

	$: isWalletConnected = $walletStore.publicKey != null;

	$: myAllShipments = $searchableShipments.data.filter(
		(el) => el.account.shipper.toString() == $walletStore.publicKey?.toString()
	);

	$: unprocessedShipments = myAllShipments.filter((el) => el.account.status == 1);
	$: processingShipments = myAllShipments.filter(
		(el) => el.account.status > 1 && el.account.status < 5
	);
	$: deliveredShipments = myAllShipments.filter((el) => el.account.status == 5);

	$: insideNavData = [
		{
			name: 'Unprocessed',
			data: unprocessedShipments
		},
		{
			name: 'Processing',
			data: processingShipments
		},
		{
			name: 'Delivered',
			data: deliveredShipments
		}
	];

	function onSelectShipment(shipment: ApiShipmentAccount) {
		if (isMobileOpen) {
			isMobileOpen = false;
		}

		selectedShipment = shipment;
	}

	function onShowClicked(shipment: ApiShipmentAccount) {
		onSelectShipment(shipment);

		showShipmentDetailsModal = true;
	}

	async function onClickConfirm() {
		console.log('confirm');
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);
		console.log(get(acceptedShipmentOffers));
		const task = get(acceptedShipmentOffers).find(
			(el) => el.shipment.publicKey === selectedShipment!.publicKey
		);

		if (!$walletStore.publicKey) {
			createNotification({ text: 'wallet not connected', type: 'failed', removeAfter: 5000 });

			walletStore.openModal();

			return;
		}

		if (!task) {
			createNotification({ text: 'offer does not exist', type: 'failed', removeAfter: 5000 });
		}

		const id = createNotification({ text: 'signing', type: 'loading', removeAfter: undefined });

		const tx = await confirmShipmentTx(
			program,
			wallet.publicKey!,
			new PublicKey(selectedShipment!.publicKey),
			new PublicKey(selectedShipment!.account.shipper),
			new PublicKey(selectedShipment!.account.forwarder),
			new PublicKey(selectedShipment!.account.carrier),
			new PublicKey(task?.meta.publicKey!)
		);

		try {
			const signature = await useSignAndSendTransaction(connection, wallet, tx);

			createNotification({ text: 'Tx send', type: 'success', removeAfter: 5000, signature });
			removeNotification(id);

			const confirmation = createNotification({
				text: 'waiting for confirmation',
				type: 'loading',
				removeAfter: 30000
			});
			awaitedConfirmation.set(confirmation);
		} catch (err) {
			createNotification({ text: 'Signing', type: 'failed', removeAfter: 5000 });
			removeNotification(id);
		}
	}
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if !isWalletConnected}
		<div class="w-full flex justify-center items-center">
			<p
				class="text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-2/3"
			>
				Connect your wallet to view shipments
			</p>
		</div>
	{:else}
		<div class="h-full flex w-full flex-col items-center">
			<div class="inline-flex shadow-sm bg-white rounded-lg m-4 flex-none">
				{#each insideNavData as { name }, i}
					<button
						aria-current="page"
						class={clsx(
							'px-4 py-2 text-md font-semibold',
							selectedNav == i
								? 'bg-gradient-to-r from-primary to-secondary text-white'
								: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
							i == 0 && 'rounded-l-lg',
							i == insideNavData.length - 1 && 'rounded-r-lg'
						)}
						on:click={() => (selectedNav = i)}
					>
						{name}
					</button>
				{/each}
			</div>

			{#if insideNavData[selectedNav] && insideNavData[selectedNav].data.length != 0}
				<div class="flex-1 flex w-full flex-col overflow-y-auto px-4 mt-5">
					<ul class="w-full flex-1 space-y-4">
						{#each insideNavData[selectedNav].data as account, i (account.publicKey)}
							<OrderListElement
								showStatus
								on:click={() => onSelectShipment(account)}
								acceptCallback={onClickConfirm}
								shipmentAccount={account}
								selectedAccount={selectedShipment?.publicKey}
							/>
						{/each}
					</ul>
				</div>
			{:else}
				<div class="flex-1 flex items-center">
					<p
						class="mb-5 text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>
						Nothing found
					</p>
				</div>
			{/if}
		</div>
	{/if}
</LayoutListWrapper>

{#if selectedShipment}
	<ShipmentInformationModal
		shipmentAccount={selectedShipment}
		bind:showModal={showShipmentDetailsModal}
	/>
{/if}

{#if isWalletConnected}
	<ShipmentsLocations shipments={insideNavData[selectedNav].data} bind:selectedShipment />
{/if}
