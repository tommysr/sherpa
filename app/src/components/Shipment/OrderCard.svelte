<script lang="ts">
	import type { Shipment } from '$src/utils/idl/shipment';
	import CancelConfirmModal from './CancelConfirmModal.svelte';
	import Card from './Card.svelte';

	export let shipment: Shipment;

	let isBuyClicked: boolean = false;

	function handleBuyOrder(e: Event) {
		console.log(e)
	}
</script>

<Card>
	<h3 slot="name">
		name
	</h3>
	<p slot="image">image</p>
	<p slot="first-info">info 1</p>
	<p slot="second-info">info 2</p>
	<svelte:fragment slot="details">
		<details>
			<summary>Precise location</summary>
			<ul>
				<li>Source: {0}</li>
				<li>Destination: {0}</li>
			</ul>
		</details>
		<details>
			<summary>Other information</summary>
			<ul>
				<li>first: {0}</li>
				<li>second: {0}</li>
			</ul>
		</details>
	</svelte:fragment>

	<div slot="footer-info">
		<button class="contrast" on:click={() => (isBuyClicked = !isBuyClicked)}> Buy </button>
		<CancelConfirmModal bind:isModalOpen={isBuyClicked} on:confirmed={handleBuyOrder}>
			
		</CancelConfirmModal>
	</div>
</Card>
