<script lang="ts" generics="T extends { signature: string }">
	import CancelConfirmModal from './CancelConfirmModal.svelte';

	type signature = string;

	export let open: boolean = false;
	export let sendTransactionHandler: () => Promise<T>;

	let disabled = false;
	let shouldSendTransaction = false;

	function reset() {
		disabled = false;
		shouldSendTransaction = false;
	}

	const sendTransaction = async (): Promise<signature> => {
		try {
			const res = await sendTransactionHandler();

			return res.signature;
		} catch (err) {
			reset();
			throw err;
		}
	};
</script>

<CancelConfirmModal
	bind:open
	bind:disabled
	on:click={() => {
		shouldSendTransaction = true;
		disabled = true;
	}}
>
	<h4 slot="header">Check your transaction</h4>

	<svelte:fragment slot="body">
		<slot name="body" />
	</svelte:fragment>

	<svelte:fragment slot="status">
		{#if shouldSendTransaction}
			{#await sendTransaction()}
				<span aria-busy="true">Sending transaction...</span>
			{:then signature}
				<ins
					>Transaction sent: <a href="https://explorer.solana.com/tx/{signature}?cluster=devnet"
						>link</a
					>
				</ins>
			{:catch err}
				{err}
			{/await}
		{/if}
	</svelte:fragment>
</CancelConfirmModal>
