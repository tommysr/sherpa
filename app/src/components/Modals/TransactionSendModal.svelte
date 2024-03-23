<script lang="ts" generics="T extends { signature: string }">
	import Error from '../Statuses/Error.svelte';
	import Pending from '../Statuses/Pending.svelte';
	import TransactionSent from '../Statuses/TransactionSent.svelte';
	import CancelConfirmModal from './CancelConfirmModal.svelte';

	export let open: boolean = false;
	export let sendTransactionHandler: () => Promise<T>;

	let disabled = false;

	enum TxStatus {
		NotInitialized,
		Pending,
		TransactionSent,
		Error
	}

	let status = {
		component: Pending,
		tx: TxStatus.NotInitialized,
		statusString: ''
	};

	let statusComponent = Pending;
	let statusString: string = '';

	$: if (!open) clearStatus();

	function clearStatus() {
		status.component = Pending;
		status.statusString = '';
		status.tx = TxStatus.NotInitialized;
	}

	function enableButton() {
		disabled = false;
	}

	const sendTransaction = async () => {
		try {
			status.statusString = 'Sending transaction...';
			status.component = Pending;
			status.tx = TxStatus.Pending;

			const res = await sendTransactionHandler();

			status.statusString = res.signature;
			status.component = TransactionSent;
			status.tx = TxStatus.TransactionSent;
		} catch (err) {
			if (typeof err === 'string') {
				status.statusString = err;
			} else status.statusString = 'An error occurred.';
			status.component = Error;
			status.tx = TxStatus.Error;

			setTimeout(enableButton, 1000);
		}
	};
</script>

<CancelConfirmModal
	bind:open
	bind:disabled
	on:confirm={async () => {
		disabled = true;
		await sendTransaction();
	}}
	on:close={() => {
		if (status.tx !== TxStatus.Pending) open = false;
	}}
>
	<h4 slot="header">Check your transaction</h4>

	<svelte:fragment slot="body">
		<slot />
	</svelte:fragment>

	<svelte:fragment slot="status">
		{#if status.statusString}
			<svelte:component this={status.component} status={status.statusString} />
		{/if}
	</svelte:fragment>
</CancelConfirmModal>
