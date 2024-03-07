<script lang="ts">
	import ShipmentMap from '$components/ShipmentMap/ShipmentMap.svelte';
	import type { MockTransportOrder } from '$src/utils/types/mockTransport';
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

	let shipmentOrder: MockTransportOrder;
</script>

<main class="container">
	<div class="grid" id="maingrid">
		<div id="order">
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
									<span>Longitude: {shipmentSourceCoord[0].toFixed(4)}</span>
									<span>Latitude: {shipmentSourceCoord[1].toFixed(4)}</span>
								</div>
							</td>
						</tr>

						<tr>
							<td>Destination Location</td>
							<td>
								<div data-type="amount">
									<span>Longitude: {shipmentDestinationCoord[0].toFixed(4)}</span>
									<span> Latitude: {shipmentDestinationCoord[1].toFixed(4)}</span>
								</div>
							</td>
						</tr>

						<tr>
							<td>Weight</td>
							<td>
								<div class="grid">
									<input
										type="weight"
										name="weight"
										placeholder="weight"
										aria-label="weight"
										required
									/>
									<select
										name="favorite-cuisine"
										aria-label="Select your favorite cuisine..."
										required
									>
										<option selected disabled value=""> kg/lb </option>
										<option>kg</option>
										<option>lb</option>
									</select>
								</div>
							</td></tr
						>
						<tr>
							<td>Date</td><td>
								<input
									type="datetime-local"
									name="datetime-local"
									aria-label="Datetime local"
									required
								/></td
							>
						</tr>
						<tr
							><td colspan="2">
								<label for="priority">Priority</label>
								<input
									id="priority"
									name="priority"
									list="priorities"
									type="range"
									min="1"
									max="7"
									step="1"
									value="3"
									required
								/>
								<datalist id="priorities">
									<option value="1">Min</option>
									<option value="2">Low</option>
									<option value="3">Medium</option>
									<option value="4">High</option>
									<option value="5">Max</option>
								</datalist>
							</td></tr
						>
						<tr>
							<td>Fragility</td><td
								><fieldset>
									<legend>Describe the package:</legend>
									<label>
										<input type="radio" name="fragility" checked />
										Ice Packaging
									</label>
									<label>
										<input type="radio" name="fragility" />
										Vacuum-Sealed Packaging
									</label>
									<label>
										<input type="radio" name="fragility" />
										Glass Containers
									</label>
									<label>
										<input type="radio" name="fragility" />
										Thin Plastic Wrap
									</label>
								</fieldset></td
							>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="2">
								<fieldset>
									<legend>Shipment preferences:</legend>
									<input type="checkbox" id="international" name="international" />
									<label for="international">International</label>
									<input type="checkbox" id="tracked" name="tracked" />
									<label for="tracked">Tracked shipping</label>
									<input type="checkbox" id="signature" name="signature" />
									<label for="signature">Signature Required</label>
								</fieldset></td
							>
						</tr>
					</tfoot>
				</table>

				<button type="submit">Create</button>
			</form>
		</div>
		<div id="map">
			<Geolocation getPosition watch on:position={handleBrowserPosition} />
			<ShipmentMap
				bind:sourceLocation={shipmentSourceCoord}
				bind:destinationLocation={shipmentDestinationCoord}
			/>
		</div>
	</div>
</main>

<style lang="scss">
	#maingrid {
		margin-top: 50px;
	}
</style>
