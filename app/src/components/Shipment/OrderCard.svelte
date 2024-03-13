<script lang="ts">
	import type {
		Shipment,
		ShipmentDimensions,
		GeoLocation,
		Geography,
		ShipmentDetails
	} from '$src/utils/idl/shipment';
	import CancelConfirmModal from './CancelConfirmModal.svelte';
	import Card from './Card.svelte';

	type Entries<T> = {
		[K in keyof T]: [K, T[K]];
	}[keyof T][];

	export let shipmentData: Shipment<string, number, string>;

	$: dimensions = Object.entries(shipmentData.shipment.dimensions) as Entries<ShipmentDimensions>;
	$: locations = Object.entries(shipmentData.shipment.geography) as Entries<Geography>;
	$: properties = Object.entries(shipmentData.shipment.details) as Entries<ShipmentDetails>;

	let isBuyClicked: boolean = false;

	function handleBuyOrder(e: Event) {
		console.log(e);
	}
</script>

<Card>
	<h3 slot="name">name</h3>
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
			<h4 slot="header">Check your order</h4>
			<svelte:fragment slot="body">
				<article>
					<header>Main factors</header>

					<p>Price: {shipmentData.price / 10 ** 6}</p>
					<p>Shipper address: {shipmentData.shipper.toString()}</p>
					<p>When: {new Date(shipmentData.shipment.when)}</p>
					<p>Deadline: {new Date(shipmentData.shipment.deadline)}</p>
				</article>

				<article>
					<header>Dimensions</header>

					<!-- just data from blockchain, need to format it, but don't know how, maybe create class
				which will format data on output -->
					{#each dimensions as [dimension, value]}
						<p>{dimension}: {value}</p>
					{/each}
				</article>

				<article>
					<header>Location</header>

					<!-- Typing?! -->
					{#each locations as [location, value]}
						<p>{location}: {value.latitude}, {value.longitude}</p>
					{/each}
				</article>

				<article slot="footer">
					<header>properties</header>
					{#each properties as [location, value]}
						<p>{location}: {value}</p>
					{/each}
				</article>
			</svelte:fragment>
		</CancelConfirmModal>
	</div>
</Card>
