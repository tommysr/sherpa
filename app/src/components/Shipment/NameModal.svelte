<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ConfirmModal from './ConfirmModal.svelte';
	const dispatch = createEventDispatcher();

	export let open: boolean = false;

	let name: string = '';
	let status: string = '';

	async function handleNameConfirmClick(e: Event) {
		if (name.length > 0 && name.length < 65) {
			open = false;
			console.log(name);

			dispatch('name', name);
		} else {
			status = 'Name must be between 1 and 64 characters';
		}
	}
</script>

<ConfirmModal class="z-1" {open} on:click={handleNameConfirmClick}>
	<h4 slot="header">You are not registered</h4>
	<svelte:fragment slot="body">
		<p>
			You are not registered as a forwarder. Please enter your name to be registered as a forwarder.
			This will allow you to buy shipment.
		</p>

		<input
			class="w-full p-4 rounded-xl border border-[theme(colors.mint)] mt-4"
			type="text"
			bind:value={name}
			placeholder="enter forwarder name to be registered"
		/>
	</svelte:fragment>
	<p slot="status">{status}</p>
</ConfirmModal>
