<script lang="ts">
	import type { ApiBoughtShipmentAccount } from '$src/utils/idl/boughtShipment';

	export let boughtShipmentAccount: ApiBoughtShipmentAccount;
</script>

<div>
	{#if boughtShipmentAccount}
		{boughtShipmentAccount.account.buyer}
	{:else}
		<p>No bought shipment</p>
	{/if}
</div>
