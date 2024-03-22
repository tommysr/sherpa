<script lang="ts">
	import OrderListElement from '$src/components/Shipment/OrderListElement.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';
	import { searchableShipments } from '$src/stores/searchableShipments';

	$: locationsOnMap = $searchableShipments.data.map((s) => s.account.shipment.geography);

	$: isLocationSelected = false;
	let selectedLocation: number | undefined = undefined;

	function onMarkerClick(i: number) {
		isLocationSelected = true;
		selectedLocation = i;
	}

	function onElementSelect(i: number) {
		isLocationSelected = true;
		selectedLocation = i;
	}
</script>

<main class="relative h-screen w-full">
	<div class="absolute z-10 w-1/5 left-1/2 transform -translate-x-1/2 top-4">
		<div class="m-3 p-0.5 rounded-full bg-gradient-to-r from-primary to-secondary">
			<label for="name" class="sr-only">Name</label>
			<input
				class="px-3 py-1.5 w-full rounded-full bg-background focus:outline-none"
				type="text"
				id="name"
				placeholder="Search"
			/>
		</div>
	</div>
	<div class="absolute top-7 right-7 z-10">
		<WalletMultiButton onClose={() => {}} />
	</div>
	<div
		class="absolute right-7 top-32 my-auto z-10 rounded-3xl h-3/4 w-1/5 p-4 shadow-xl overflow-y-auto bg-background"
	>
		<!-- {#if $searchableShipments.filtered.length != 0}
			<OrderCardDemo shipmentAccount={$searchableShipments.filtered[selectedLocation]} />
		{:else}
			<p>Nothing found</p>
		{/if} -->

		{#if $searchableShipments.filtered.length != 0}
			<ul>
				{#each $searchableShipments.filtered as account, i}
					<OrderListElement
						on:click={() => onElementSelect(i)}
						shipmentAccount={account}
						{selectedLocation}
						shipmentId={i}
					/>
				{/each}
			</ul>
		{:else}
			<p>Nothing found</p>
		{/if}
	</div>
	<ShipmentsMap locations={locationsOnMap} {onMarkerClick} {selectedLocation} />
</main>
