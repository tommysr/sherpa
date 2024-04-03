<script lang="ts">
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import { forwardedShipmentsMeta } from '$src/stores/forwarderShipments';
	import { notForwardedShipments } from '$src/stores/searchableShipments';
	import { walletStore } from '$stores/wallet';
	import clsx from 'clsx';

	enum OperationMode {
		VIEW,
		SELL
	}

	$: if ($walletStore.publicKey) {
		// TODO: make it custom
		forwardedShipmentsMeta.update((s) => {
			s.filter((s) => s.account.forwarder === $walletStore.publicKey?.toString());

			return s;
		});
	}

	$: isWalletConnected = $walletStore.publicKey != null;

	let selectedLocation: number | undefined = undefined;
	let selectedCarrier: number | undefined = undefined;
	let isMobileOpen = false;
	let selectedNav: number = 0;

	function onShipmentElementSelect(i: number) {
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onCarrierElementSelect(i: number) {
		selectedCarrier = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onMarkerClick(i: number) {
		selectedLocation = i;

		if (isMobileOpen) {
			isMobileOpen = false;
		}
	}

	function onCarrierMarkerClick(i: number) {
		selectedCarrier = i;
	}

	const insideNavData = [
		{
			name: 'Everything',
			data: []
		},
		{
			name: 'Processing',
			data: []
		},
		{
			name: 'Delivered',
			data: []
		}
	];
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
				<ul class="w-full flex-1">
					{#each $notForwardedShipments as account, i (account.publicKey)}
						<OrderListElement
							on:click={() => {}}
							shipmentAccount={account}
							{selectedLocation}
							shipmentId={i}
						/>
					{/each}
				</ul>
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
<!-- 
{#if isWalletConnected}
	<ShipmentsLocations
		locations={locationsOnMap}
		{onMarkerClick}
		{selectedLocation}
		exclusive={isExclusiveMode}
		isMobile={false}
	/>
{/if} -->
