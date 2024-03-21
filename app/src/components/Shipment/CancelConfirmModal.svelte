<script lang="ts">
	import SimpleButton from '../Buttons/SimpleButton.svelte';

	export let open: boolean = false;
	export let disabled: boolean = false;

	function closeModal(_e: Event) {
		open = false;
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
				<SimpleButton value="Cancel" on:click={closeModal} />
				<SimpleButton value="Confirm" on:click {disabled} />
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
