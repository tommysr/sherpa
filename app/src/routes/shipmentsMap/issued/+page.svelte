<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { walletStore } from '$stores/wallet';
	import clsx from 'clsx';

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
								on:buttonClicked={() => onShowClicked(account)}
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
