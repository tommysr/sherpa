<script lang="ts">
	let modalElement: HTMLDialogElement;
	let statusElement: HTMLDivElement;

	// TODO: add these classes to html to prevent scrolling and add animationm
	// const isOpenClass = 'modal-is-open';
	// const openingClass = 'modal-is-opening';
	// const closingClass = 'modal-is-closing';

	export let isModalOpen: boolean = false;
	export let confirmClickHandler: (e: Event) => Promise<string>;

	let confirmButtonDisabled = false;
	let status = 'confirm';
	let signature: string;

	// To open modal from other components
	$: {
		if (isModalOpen) {
			openModal();
		}
	}

	function openModal() {
		isModalOpen = true;
		modalElement.setAttribute('open', '');
	}

	function closeModal() {
		isModalOpen = false;
		modalElement.removeAttribute('open');
	}

	async function handleConfirmClick(e: Event) {
		try {
			status = 'Preparing transaction';
			confirmButtonDisabled = true;
			signature = await confirmClickHandler(e);
			status = 'Transaction sent';
		} catch (error) {
			confirmButtonDisabled = false;
		}
	}
</script>

<dialog  id="confirm-modal" bind:this={modalElement}>
	<article>
		<header>
			<slot name="header" />
		</header>

		<slot name="body" />

		<footer>
			<!-- should be outside of this component -->
			{#if status === 'confirm'}
				<span aria-busy="false">Click confirm to buy</span>
			{:else if status === 'Preparing transaction'}
				<span aria-busy="true">Sending transaction...</span>
			{:else if status === 'Transaction sent'}
				<ins
					>Transaction sent: <a href="https://explorer.solana.com/tx/{signature}?cluster=devnet"
						>explorer</a
					>
				</ins>
			{/if}
			<span>
				<button role="button" class="secondary" data-target="confirm-modal" on:click={closeModal}>
					Cancel</button
				><button
					role="button"
					autofocus
					data-target="confirm-modal"
					on:click={handleConfirmClick}
					disabled={confirmButtonDisabled}>confirm</button
				>
			</span>
		</footer>
	</article>
</dialog>

<style lang="scss">
	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
