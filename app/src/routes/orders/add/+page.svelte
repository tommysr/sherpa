<script lang="ts">
	import ShipmentMap from '$components/ShipmentMap/ShipmentMap.svelte';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';

	const START_POSITION: [number, number] = [15, 50];
	const OFFSET_START_POSITION: [number, number] = [START_POSITION[0] + 1, START_POSITION[1] + 1];

	let shipmentSourceCoord: [number, number] = START_POSITION;
	let shipmentDestinationCoord: [number, number] = OFFSET_START_POSITION;

	function handleBrowserPosition(e: any) {
		console.log(e.detail);
		const coords = e.detail.coords;
		shipmentSourceCoord = [coords.longitude, coords.latitude];
	}
</script>

<main class="container">
	<div class="grid">
		<div>
			<form>
				<label for="amount">Ship payment in SOL</label>
				<input
					id="amount"
					name="amount"
					type="number"
					min="0.001"
					value="0.01"
					step="0.001"
					placeholder="0.01"
					required
				/>
				<table>
					<tbody>
						<tr>
							<td>Source Location </td>
							<td>
								<div data-type="amount">
									<span id="transaction-fees-btc" data-type="btc"
										>Longitude: {shipmentSourceCoord[0].toFixed(4)}</span
									>
									<span id="transaction-fees-usd" data-type="usd"
										>Latitude: {shipmentSourceCoord[1].toFixed(4)}</span
									>
								</div>
							</td>
						</tr>

						<tr>
							<td>Destination Location</td>
							<td>
								<div data-type="amount">
									<span id="transaction-fees-btc" data-type="btc"
										>Longitude: {shipmentDestinationCoord[0].toFixed(4)}</span
									>
									<span id="transaction-fees-usd" data-type="usd">
										Latitude: {shipmentDestinationCoord[1].toFixed(4)}</span
									>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<button type="submit">Create</button>
			</form>
		</div>
		<div>
			<Geolocation getPosition watch on:position={handleBrowserPosition} />
			<ShipmentMap
				bind:sourceLocation={shipmentSourceCoord}
				bind:destinationLocation={shipmentDestinationCoord}
			/>
		</div>
	</div>
</main>

<style lang="scss">
</style>
