<script lang="ts">
	import type { GeoLocation } from '$src/utils/idl/shipment';
	import Card from './Card.svelte';

	export let name: string;
	export let from: GeoLocation;
	export let to: GeoLocation;
	export let date: Date;
</script>

<Card>
	<h3 slot="name">
		{name}
	</h3>
	<p slot="image">There will be image</p>
	<p slot="first-info">info 1</p>
	<p slot="second-info">info 2</p>
	<svelte:fragment slot="details">
		<details>
			<summary>Precise location</summary>
			<ul>
				<li>Source: {Object.values(from)}</li>
				<li>Destination: {Object.values(to)}</li>
			</ul>
		</details>
		<details>
			<summary>Other information</summary>
			<ul>
				<li>Source: {Object.values(from)}</li>
				<li>Destination: {Object.values(to)}</li>
			</ul>
		</details>
	</svelte:fragment>

	<p slot="footer-info">
		{date}
	</p>
</Card>
