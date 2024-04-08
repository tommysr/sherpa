<script lang="ts">
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import { getShipmentSummary } from '$src/utils/utils';

	import SummaryWrapper from '../SummaryWrapper.svelte';
	import Modal from './Modal.svelte';

	export let showModal: boolean;
	export let shipmentAccount: ApiShipmentAccount;

	$: summaryData = getShipmentSummary(shipmentAccount.account);
</script>

<Modal bind:showModal on:backdropClick={() => (showModal = false)}>
	<h2
		class="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center my-7"
	>
		Shipment Details
	</h2>
	<SummaryWrapper shipment={summaryData} />
</Modal>
