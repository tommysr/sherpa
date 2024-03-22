<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import SimpleButton from '../Buttons/SimpleButton.svelte';
	export let open: boolean = false;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	function handleConfirmClick() {
		disabled = true;
		dispatch('confirm');
	}
</script>

<dialog {open}>
	<article>
		<header>
			<slot name="header" />
		</header>

		<slot name="body" />

		<footer>
			<slot name="status" />

			<span>
				<SimpleButton
					value="Cancel"
					on:click={() => {
						open = false;
					}}
				/>
				<SimpleButton value="Confirm" on:click={handleConfirmClick} {disabled} />
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
