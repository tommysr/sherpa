<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import ShipmentInformationModal from '$src/components/Modals/ShipmentInformationModal.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsLocations from '$src/components/ShipmentMap/ShipmentsLocations.svelte';
	import { searchableShipments } from '$src/stores/searchableShipments';
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { walletStore } from '$stores/wallet';
	import clsx from 'clsx';

	$: isWalletConnected = $walletStore.publicKey != null;

	let showShipmentDetailsModal = false;
	let selectedShipment: ApiShipmentAccount | undefined = undefined;
	let selectedLocation: number | undefined = undefined;
	let isMobileOpen = false;
	let selectedNav: number = 0;

	$: myAllShipments = $searchableShipments.data.filter(
		(el) => el.account.shipper.toString() == $walletStore.publicKey?.toString()
	);
	$: processingShipments = myAllShipments.filter((el) => el.account.status != 1);
	$: deliveredShipments = myAllShipments.filter((el) => el.account.status == 5);
	$: shipmentLocations = insideNavData[selectedNav].data.map((el) => el.account.shipment.geography);
	$: insideNavData = [
		{
			name: 'Everything',
			data: myAllShipments
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

	function onMarkerClick(i: number) {
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if !isWalletConnected}
		<p
			class="mt-1 text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-2/3"
		>
			Connect your wallet to view shipments
		</p>
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
								on:click={() => {
									onMarkerClick(i);
								}}
								on:buttonClicked={() => {
									selectedShipment = account;
									showShipmentDetailsModal = true;
								}}
								shipmentAccount={account}
								{selectedLocation}
								shipmentId={i}
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

<ShipmentsLocations
	locations={shipmentLocations}
	{onMarkerClick}
	{selectedLocation}
	exclusive={false}
	isMobile={false}
/>
