<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ConfirmModal from '../Shipment/ConfirmModal.svelte';
	const SECS_IN_MINUTE = 60;
	const dispatch = createEventDispatcher();

	export let open: boolean = false;

	let price: number;
	let timeInMinutes: number;
	let status: string = '';
	$: secs = timeInMinutes * 60;

	async function handleNameConfirmClick(e: Event) {
		if (price > 0 && secs > SECS_IN_MINUTE * 30) {
			open = false;

			dispatch('offerDetails', { price, secs });
		} else {
			status = 'Price must be higher than zero and time must be at least 30 minutes';
		}
	}
</script>

<ConfirmModal class="z-1" {open} on:click={handleNameConfirmClick}>
	<h4 slot="header">Make offer</h4>
	<svelte:fragment slot="body">
		<p>Enter the amount you want to pay and the time when the offer will expire.</p>

		<input
			class="w-full p-4 rounded-xl border border-[theme(colors.mint)] mt-4"
			type="amount"
			bind:value={timeInMinutes}
			placeholder="enter expiration in minutes"
		/>

		<input
			class="w-full p-4 rounded-xl border border-[theme(colors.mint)] mt-4"
			type="amount"
			bind:value={price}
			placeholder="enter amount to pay"
		/>
	</svelte:fragment>
	<p slot="status">{status}</p>
</ConfirmModal>
