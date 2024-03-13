<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let modalElement: HTMLDialogElement;

	// TODO: add these classes to html to prevent scrolling and add animationm
	// const isOpenClass = 'modal-is-open';
	// const openingClass = 'modal-is-opening';
	// const closingClass = 'modal-is-closing';

	const dispatch = createEventDispatcher();

	export let isModalOpen: boolean = false;

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

	function handleConfirmClick(e: Event) {
       dispatch('confirmed')
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
			><button autofocus data-target="confirm-modal" on:click={handleConfirmClick}>Confirm</button>
		</footer>
	</article>
</dialog>

<style lang="scss">

</style>
