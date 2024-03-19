<script lang="ts">
	import SimpleButton from '../Buttons/SimpleButton.svelte';

	let modalElement: HTMLDialogElement;
	export let open: boolean = false;

	let className = '';
	export { className as class };

	// $: {
	// 	if (isModalOpen) {
	// 		openModal();
	// 	} else {
	// 		closeModal();
	// 	}
	// }

	// function openModal() {
	// 	isModalOpen = true;
	// 	modalElement.setAttribute('open', '');
	// }

	// function closeModal() {
	// 	isModalOpen = false;
	// 	modalElement.removeAttribute('open');
	// }
</script>

<dialog class={className} bind:this={modalElement} {open}>
	<article>
		<header>
			<slot name="header" />
		</header>
		<slot name="body" />
		<footer class="flex justify-between">
			<slot name="status" />
			<SimpleButton value="Confirm" on:click />
		</footer>
	</article>
</dialog>
