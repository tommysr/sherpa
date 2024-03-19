<script lang="ts">
	import type { ApiBoughtShipmentAccount } from '$src/utils/idl/boughtShipment';
	import ShipmentDataView from './ShipmentDataView.svelte';

	export let boughtShipmentAccount: ApiBoughtShipmentAccount;
</script>

<div class="mt-5 flex flex-col border p-3 border-[theme(colors.green-mate)]">
	<div class="mb-4 gap-x-10 flex justify-between space-between">
		<div class="text-center max-w-20 rounded-full border px-1 text-sm border-[theme(colors.green)]">
			Shipper
		</div>
		{#if boughtShipmentAccount}
			<div class="truncate">{boughtShipmentAccount.account.owner}</div>
		{:else}
			<p>No bought shipment</p>
		{/if}
	</div>

	<ShipmentDataView shipmentData={boughtShipmentAccount.account.shipment} />
</div>
