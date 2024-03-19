<script lang="ts">
	import type {
		ShipmentData,
		ShipmentDimensions,
		Geography,
		ShipmentDetails
	} from '$src/utils/idl/shipment';
	import type { Entries } from '$utils/types/object';

	export let shipmentData: ShipmentData<string>;

	let isMetricTon = shipmentData.dimensions.depth == 0;

	let dimensions = Object.entries(shipmentData.dimensions) as Entries<ShipmentDimensions>;
	let locations = Object.entries(shipmentData.geography) as Entries<Geography>;
	let properties = Object.entries(shipmentData.details) as Entries<ShipmentDetails>;

	async function getLocationFromCoords(lat: number, long: number): Promise<string> {
		// there are limits, only 1per sec, so caching is needed or some better provider.
		return `Kraków, Poland`;
		// const response = await fetch(
		// 	`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`
		// );
		// const data = await response.json();

		// console.log(data.address);
		// if (data.address.village) {
		// 	return data.address.village;
		// } else if (data.address.city && data.address.city_district) {
		// 	return `${data.address.city}, ${data.address.city_district}`;
		// } else {
		// 	throw Error('No location found');
		// }
	}
</script>

<div class="space-y-3 p-3 max-w-90 border border-[theme(colors.mint)] rounded-md">
	<div class="flex justify-between items-center space-between">
		{#if locations}
			<div class="rounded-full border px-1 text-sm border-[theme(colors.green)]">Locations</div>
			{@const len = locations.length}

			{#each locations as [location, value], index}
				{#await getLocationFromCoords(value.latitude, value.longitude)}
					fetching...
				{:then location}
					<div>
						{location}
					</div>
				{:catch error}
					{value.latitude.toFixed(4)} {value.longitude.toFixed(4)}
				{/await}

				{#if index != len - 1}
					<div>
						{'→ '}
					</div>
				{/if}
			{/each}
		{:else}
			<p>No location</p>
		{/if}
	</div>
	<div class="flex justify-between items-center space-between">
		{#if dimensions}
			<div class="rounded-full border px-1 text-sm border-[theme(colors.green)]">Dimensions</div>
			{@const len = dimensions.length}
			{#each dimensions as [dimension, value], index}
				<div>
					{dimension[0]}: {value}
				</div>
				<!-- TODO: add these on blockchain, would be nice to have some objects 
representing different properties -->
				{#if index == len - 1}
					kg
				{:else}
					m
				{/if}

				{#if index == len - 2}
					<br />
				{/if}
			{/each}
		{:else}
			<p>No dimensions</p>
		{/if}
	</div>
</div>
