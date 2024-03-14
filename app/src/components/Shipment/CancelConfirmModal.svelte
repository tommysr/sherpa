<script lang="ts">

	let modalElement: HTMLDialogElement;

	// TODO: add these classes to html to prevent scrolling and add animationm
	// const isOpenClass = 'modal-is-open';
	// const openingClass = 'modal-is-opening';
	// const closingClass = 'modal-is-closing';


	export let isModalOpen: boolean = false;
	export let confirmClickHandler: (e: Event) => Promise<void>;

	let confirmButtonDisabled = false;
	let buttonValue = 'confirm';

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
			buttonValue = 'Preparing transaction'
			confirmButtonDisabled = true;
			await confirmClickHandler(e);
			buttonValue = 'Transaction sent'
		} catch (error) {
			confirmButtonDisabled = false;
			console.error(error);
		}
	}
</script>

<dialog id="confirm-modal" bind:this={modalElement}>
	<article>
		<header>
			<slot name="header" />
		</header>

		<slot name="body" />

		<footer>
			<slot name="footer" />
			<button role="button" class="secondary" data-target="confirm-modal" on:click={closeModal}>
				Cancel</button
			><button autofocus data-target="confirm-modal" on:click={handleConfirmClick} disabled={confirmButtonDisabled}
				>{buttonValue}</button
			>
		</footer>
	</article>
</dialog>

<style lang="scss">
</style>
